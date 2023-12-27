# Version 3

- the library is now based on ESM

- taxonomy worker now used internally - no need to ask for it

- the `<OmniCourse>` component:

  - now includes a mandatory `locale` property, which is a LocaleLike from Hermes

  - has `taxonomyKeysFetcher` renamed to `TaxonomyPreviewsFetcher` - both parameter and type

  - has dropped the `taxonomyReifier` property

- CSS root is now named `index.css`

- no more root div with `omniCourse` class (which still remains in the CSS); consequently, no more `customClassName` property

- The `TaxonomyKey` struct no more exists - replaced by `TaxonomyId`, which is a plain `string` alias
