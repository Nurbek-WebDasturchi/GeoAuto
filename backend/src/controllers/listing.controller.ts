import { ListingService } from "../services/listing.service.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ok } from "../utils/http.js";

export const ListingController = {
  list: asyncHandler(async (req, res) => {
    const result = await ListingService.list(req.query as never);
    res.json(ok(result.items, { total: result.total, page: result.page, limit: result.limit }));
  }),

  detail: asyncHandler(async (req, res) => {
    const listing = await ListingService.getById(String(req.params.id), req.user?.id);
    res.json(ok(listing));
  }),

  create: asyncHandler(async (req, res) => {
    const files = (req.files as Express.Multer.File[]) ?? [];
    const listing = await ListingService.create(req.user!.id, req.body, files);
    res.status(201).json(ok(listing));
  }),

  update: asyncHandler(async (req, res) => {
    const listing = await ListingService.update(String(req.params.id), req.user!.id, req.body);
    res.json(ok(listing));
  }),

  remove: asyncHandler(async (req, res) => {
    await ListingService.remove(String(req.params.id), req.user!.id);
    res.status(204).send();
  }),

  favorite: asyncHandler(async (req, res) => {
    await ListingService.favorite(req.user!.id, String(req.params.id));
    res.status(204).send();
  }),

  unfavorite: asyncHandler(async (req, res) => {
    await ListingService.unfavorite(req.user!.id, String(req.params.id));
    res.status(204).send();
  }),

  favorites: asyncHandler(async (req, res) => {
    const favorites = await ListingService.favorites(req.user!.id);
    res.json(ok(favorites.map((item: { listing: unknown }) => item.listing)));
  }),

  similar: asyncHandler(async (req, res) => {
    const listings = await ListingService.similar(String(req.params.id));
    res.json(ok(listings));
  }),

  report: asyncHandler(async (req, res) => {
    const report = await ListingService.report(req.user!.id, String(req.params.id), req.body.reason);
    res.status(201).json(ok(report));
  })
};
