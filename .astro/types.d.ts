declare module 'astro:content' {
	interface Render {
		'.md': Promise<{
			Content: import('astro').MarkdownInstance<{}>['Content'];
			headings: import('astro').MarkdownHeading[];
			remarkPluginFrontmatter: Record<string, any>;
		}>;
	}
}

declare module 'astro:content' {
	export { z } from 'astro/zod';
	export type CollectionEntry<C extends keyof AnyEntryMap> = AnyEntryMap[C][keyof AnyEntryMap[C]];

	// TODO: Remove this when having this fallback is no longer relevant. 2.3? 3.0? - erika, 2023-04-04
	/**
	 * @deprecated
	 * `astro:content` no longer provide `image()`.
	 *
	 * Please use it through `schema`, like such:
	 * ```ts
	 * import { defineCollection, z } from "astro:content";
	 *
	 * defineCollection({
	 *   schema: ({ image }) =>
	 *     z.object({
	 *       image: image(),
	 *     }),
	 * });
	 * ```
	 */
	export const image: never;

	// This needs to be in sync with ImageMetadata
	export type ImageFunction = () => import('astro/zod').ZodObject<{
		src: import('astro/zod').ZodString;
		width: import('astro/zod').ZodNumber;
		height: import('astro/zod').ZodNumber;
		format: import('astro/zod').ZodUnion<
			[
				import('astro/zod').ZodLiteral<'png'>,
				import('astro/zod').ZodLiteral<'jpg'>,
				import('astro/zod').ZodLiteral<'jpeg'>,
				import('astro/zod').ZodLiteral<'tiff'>,
				import('astro/zod').ZodLiteral<'webp'>,
				import('astro/zod').ZodLiteral<'gif'>,
				import('astro/zod').ZodLiteral<'svg'>
			]
		>;
	}>;

	type BaseSchemaWithoutEffects =
		| import('astro/zod').AnyZodObject
		| import('astro/zod').ZodUnion<import('astro/zod').AnyZodObject[]>
		| import('astro/zod').ZodDiscriminatedUnion<string, import('astro/zod').AnyZodObject[]>
		| import('astro/zod').ZodIntersection<
				import('astro/zod').AnyZodObject,
				import('astro/zod').AnyZodObject
		  >;

	type BaseSchema =
		| BaseSchemaWithoutEffects
		| import('astro/zod').ZodEffects<BaseSchemaWithoutEffects>;

	export type SchemaContext = { image: ImageFunction };

	type DataCollectionConfig<S extends BaseSchema> = {
		type: 'data';
		schema?: S | ((context: SchemaContext) => S);
	};

	type ContentCollectionConfig<S extends BaseSchema> = {
		type?: 'content';
		schema?: S | ((context: SchemaContext) => S);
	};

	type CollectionConfig<S> = ContentCollectionConfig<S> | DataCollectionConfig<S>;

	export function defineCollection<S extends BaseSchema>(
		input: CollectionConfig<S>
	): CollectionConfig<S>;

	type AllValuesOf<T> = T extends any ? T[keyof T] : never;
	type ValidContentEntrySlug<C extends keyof ContentEntryMap> = AllValuesOf<
		ContentEntryMap[C]
	>['slug'];

	export function getEntryBySlug<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {})
	>(
		collection: C,
		// Note that this has to accept a regular string too, for SSR
		entrySlug: E
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;

	export function getDataEntryById<C extends keyof DataEntryMap, E extends keyof DataEntryMap[C]>(
		collection: C,
		entryId: E
	): Promise<CollectionEntry<C>>;

	export function getCollection<C extends keyof AnyEntryMap, E extends CollectionEntry<C>>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => entry is E
	): Promise<E[]>;
	export function getCollection<C extends keyof AnyEntryMap>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => unknown
	): Promise<CollectionEntry<C>[]>;

	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {})
	>(entry: {
		collection: C;
		slug: E;
	}): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {})
	>(entry: {
		collection: C;
		id: E;
	}): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {})
	>(
		collection: C,
		slug: E
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {})
	>(
		collection: C,
		id: E
	): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;

	/** Resolve an array of entry references from the same collection */
	export function getEntries<C extends keyof ContentEntryMap>(
		entries: {
			collection: C;
			slug: ValidContentEntrySlug<C>;
		}[]
	): Promise<CollectionEntry<C>[]>;
	export function getEntries<C extends keyof DataEntryMap>(
		entries: {
			collection: C;
			id: keyof DataEntryMap[C];
		}[]
	): Promise<CollectionEntry<C>[]>;

	export function reference<C extends keyof AnyEntryMap>(
		collection: C
	): import('astro/zod').ZodEffects<
		import('astro/zod').ZodString,
		C extends keyof ContentEntryMap
			? {
					collection: C;
					slug: ValidContentEntrySlug<C>;
			  }
			: {
					collection: C;
					id: keyof DataEntryMap[C];
			  }
	>;
	// Allow generic `string` to avoid excessive type errors in the config
	// if `dev` is not running to update as you edit.
	// Invalid collection names will be caught at build time.
	export function reference<C extends string>(
		collection: C
	): import('astro/zod').ZodEffects<import('astro/zod').ZodString, never>;

	type ReturnTypeOrOriginal<T> = T extends (...args: any[]) => infer R ? R : T;
	type InferEntrySchema<C extends keyof AnyEntryMap> = import('astro/zod').infer<
		ReturnTypeOrOriginal<Required<ContentConfig['collections'][C]>['schema']>
	>;

	type ContentEntryMap = {
		"briquette": {
"round.md": {
	id: "round.md";
  slug: "round";
  body: string;
  collection: "briquette";
  data: InferEntrySchema<"briquette">
} & { render(): Render[".md"] };
"ruf.md": {
	id: "ruf.md";
  slug: "ruf";
  body: string;
  collection: "briquette";
  data: InferEntrySchema<"briquette">
} & { render(): Render[".md"] };
};
"firewood": {
"firewood.md": {
	id: "firewood.md";
  slug: "firewood";
  body: string;
  collection: "firewood";
  data: InferEntrySchema<"firewood">
} & { render(): Render[".md"] };
};
"parquette": {
"acacia-nature.md": {
	id: "acacia-nature.md";
  slug: "acacia-nature";
  body: string;
  collection: "parquette";
  data: InferEntrySchema<"parquette">
} & { render(): Render[".md"] };
"acacia-rustic.md": {
	id: "acacia-rustic.md";
  slug: "acacia-rustic";
  body: string;
  collection: "parquette";
  data: InferEntrySchema<"parquette">
} & { render(): Render[".md"] };
"ash-extra.md": {
	id: "ash-extra.md";
  slug: "ash-extra";
  body: string;
  collection: "parquette";
  data: InferEntrySchema<"parquette">
} & { render(): Render[".md"] };
"ash-nature.md": {
	id: "ash-nature.md";
  slug: "ash-nature";
  body: string;
  collection: "parquette";
  data: InferEntrySchema<"parquette">
} & { render(): Render[".md"] };
"beech-nature.md": {
	id: "beech-nature.md";
  slug: "beech-nature";
  body: string;
  collection: "parquette";
  data: InferEntrySchema<"parquette">
} & { render(): Render[".md"] };
"cherry-natural.md": {
	id: "cherry-natural.md";
  slug: "cherry-natural";
  body: string;
  collection: "parquette";
  data: InferEntrySchema<"parquette">
} & { render(): Render[".md"] };
"elm-rustic.md": {
	id: "elm-rustic.md";
  slug: "elm-rustic";
  body: string;
  collection: "parquette";
  data: InferEntrySchema<"parquette">
} & { render(): Render[".md"] };
"maple-rustic.md": {
	id: "maple-rustic.md";
  slug: "maple-rustic";
  body: string;
  collection: "parquette";
  data: InferEntrySchema<"parquette">
} & { render(): Render[".md"] };
"natural-maple.md": {
	id: "natural-maple.md";
  slug: "natural-maple";
  body: string;
  collection: "parquette";
  data: InferEntrySchema<"parquette">
} & { render(): Render[".md"] };
"natural-oak.md": {
	id: "natural-oak.md";
  slug: "natural-oak";
  body: string;
  collection: "parquette";
  data: InferEntrySchema<"parquette">
} & { render(): Render[".md"] };
"natural-oiled-oak.md": {
	id: "natural-oiled-oak.md";
  slug: "natural-oiled-oak";
  body: string;
  collection: "parquette";
  data: InferEntrySchema<"parquette">
} & { render(): Render[".md"] };
"natural-pear.md": {
	id: "natural-pear.md";
  slug: "natural-pear";
  body: string;
  collection: "parquette";
  data: InferEntrySchema<"parquette">
} & { render(): Render[".md"] };
"oak-extra.md": {
	id: "oak-extra.md";
  slug: "oak-extra";
  body: string;
  collection: "parquette";
  data: InferEntrySchema<"parquette">
} & { render(): Render[".md"] };
"oak-vs.md": {
	id: "oak-vs.md";
  slug: "oak-vs";
  body: string;
  collection: "parquette";
  data: InferEntrySchema<"parquette">
} & { render(): Render[".md"] };
"plum-rustic.md": {
	id: "plum-rustic.md";
  slug: "plum-rustic";
  body: string;
  collection: "parquette";
  data: InferEntrySchema<"parquette">
} & { render(): Render[".md"] };
"rustic-ash.md": {
	id: "rustic-ash.md";
  slug: "rustic-ash";
  body: string;
  collection: "parquette";
  data: InferEntrySchema<"parquette">
} & { render(): Render[".md"] };
"rustic-oak.md": {
	id: "rustic-oak.md";
  slug: "rustic-oak";
  body: string;
  collection: "parquette";
  data: InferEntrySchema<"parquette">
} & { render(): Render[".md"] };
"thermo-ash-choco.md": {
	id: "thermo-ash-choco.md";
  slug: "thermo-ash-choco";
  body: string;
  collection: "parquette";
  data: InferEntrySchema<"parquette">
} & { render(): Render[".md"] };
"thermo-ash.md": {
	id: "thermo-ash.md";
  slug: "thermo-ash";
  body: string;
  collection: "parquette";
  data: InferEntrySchema<"parquette">
} & { render(): Render[".md"] };
"walnut-rustic.md": {
	id: "walnut-rustic.md";
  slug: "walnut-rustic";
  body: string;
  collection: "parquette";
  data: InferEntrySchema<"parquette">
} & { render(): Render[".md"] };
};
"pellet": {
"delnice.md": {
	id: "delnice.md";
  slug: "delnice";
  body: string;
  collection: "pellet";
  data: InferEntrySchema<"pellet">
} & { render(): Render[".md"] };
"gold.md": {
	id: "gold.md";
  slug: "gold";
  body: string;
  collection: "pellet";
  data: InferEntrySchema<"pellet">
} & { render(): Render[".md"] };
"grupa.md": {
	id: "grupa.md";
  slug: "grupa";
  body: string;
  collection: "pellet";
  data: InferEntrySchema<"pellet">
} & { render(): Render[".md"] };
"more.md": {
	id: "more.md";
  slug: "more";
  body: string;
  collection: "pellet";
  data: InferEntrySchema<"pellet">
} & { render(): Render[".md"] };
"pin.md": {
	id: "pin.md";
  slug: "pin";
  body: string;
  collection: "pellet";
  data: InferEntrySchema<"pellet">
} & { render(): Render[".md"] };
"platin.md": {
	id: "platin.md";
  slug: "platin";
  body: string;
  collection: "pellet";
  data: InferEntrySchema<"pellet">
} & { render(): Render[".md"] };
"spelet.md": {
	id: "spelet.md";
  slug: "spelet";
  body: string;
  collection: "pellet";
  data: InferEntrySchema<"pellet">
} & { render(): Render[".md"] };
"woody.md": {
	id: "woody.md";
  slug: "woody";
  body: string;
  collection: "pellet";
  data: InferEntrySchema<"pellet">
} & { render(): Render[".md"] };
};

	};

	type DataEntryMap = {
		
	};

	type AnyEntryMap = ContentEntryMap & DataEntryMap;

	type ContentConfig = typeof import("../src/content/config");
}
