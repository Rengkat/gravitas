import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import type { Request } from 'express';
import {
  FindManyOptions,
  ObjectLiteral,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import {
  PaginatedResult,
  PaginationLinks,
  PaginationMeta,
  PaginationOptions,
} from './pagination.interface';

@Injectable()
export class PaginationProvider {
  constructor(
    @Inject(REQUEST)
    private readonly request: Request,
  ) {}

  // ── Shared: build base URL from request ────────────────────────────────
  private buildBaseUrl(): string {
    return `${this.request.protocol}://${this.request.headers.host}${this.request.path}`;
  }

  // ── Shared: build meta object ──────────────────────────────────────────
  private buildMeta(
    totalItems: number,
    itemCount: number,
    page: number,
    limit: number,
  ): PaginationMeta {
    const totalPages = Math.ceil(totalItems / limit) || 1;
    return {
      totalItems,
      itemCount,
      itemsPerPage: limit,
      totalPages,
      currentPage: page,
      hasPreviousPage: page > 1,
      hasNextPage: page < totalPages,
    };
  }

  // ── Shared: build links object ─────────────────────────────────────────
  private buildLinks(
    baseUrl: string,
    page: number,
    limit: number,
    totalPages: number,
  ): PaginationLinks {
    return {
      first: `${baseUrl}?limit=${limit}&page=1`,
      previous: page > 1 ? `${baseUrl}?limit=${limit}&page=${page - 1}` : null,
      current: `${baseUrl}?limit=${limit}&page=${page}`,
      next:
        page < totalPages ? `${baseUrl}?limit=${limit}&page=${page + 1}` : null,
      last: `${baseUrl}?limit=${limit}&page=${totalPages}`,
    };
  }

  // ── Shared: sanitize options ───────────────────────────────────────────
  private sanitize(options: PaginationOptions): {
    page: number;
    limit: number;
  } {
    return {
      page: Math.max(1, options.page ?? 1),
      limit: Math.min(100, Math.max(1, options.limit ?? 20)),
    };
  }

  // ── Method 1: QueryBuilder pagination ─────────────────────────────────
  // Use when you need joins, complex filters, or custom ordering
  async paginateQueryBuilder<T extends ObjectLiteral>(
    qb: SelectQueryBuilder<T>,
    options: PaginationOptions,
  ): Promise<PaginatedResult<T>> {
    const { page, limit } = this.sanitize(options);
    const baseUrl = this.buildBaseUrl();

    const [data, totalItems] = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    const meta = this.buildMeta(totalItems, data.length, page, limit);
    const links = this.buildLinks(baseUrl, page, limit, meta.totalPages);

    return { data, meta, links };
  }

  // ── Method 2: Repository pagination ───────────────────────────────────
  // Use for simple queries without joins
  async paginate<T extends ObjectLiteral>(
    repository: Repository<T>,
    options: PaginationOptions,
    findOptions?: FindManyOptions<T>,
  ): Promise<PaginatedResult<T>> {
    const { page, limit } = this.sanitize(options);
    const baseUrl = this.buildBaseUrl();

    const [data, totalItems] = await repository.findAndCount({
      ...findOptions,
      skip: (page - 1) * limit,
      take: limit,
    });

    const meta = this.buildMeta(totalItems, data.length, page, limit);
    const links = this.buildLinks(baseUrl, page, limit, meta.totalPages);

    return { data, meta, links };
  }

  // ── Method 3: Raw array pagination ────────────────────────────────────
  // Use when data is already in memory
  paginateArray<T>(array: T[], options: PaginationOptions): PaginatedResult<T> {
    const { page, limit } = this.sanitize(options);
    const baseUrl = this.buildBaseUrl();

    const start = (page - 1) * limit;
    const data = array.slice(start, start + limit);
    const meta = this.buildMeta(array.length, data.length, page, limit);
    const links = this.buildLinks(baseUrl, page, limit, meta.totalPages);

    return { data, meta, links };
  }
}
