import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  createContext,
  ReactNode
} from "react";
import {
  formatError,
  TaxonomyKey,
  validateTaxonomyKeys,
  TaxonomyRepository,
  Subject,
  TaxonomyLevel,
  TaxonomyPath
} from "@giancosta86/omnicourse-core";

export type TaxonomyKeysFetcher = () => Promise<readonly TaxonomyKey[]>;

export interface LearningContext {
  taxonomyKeys?: readonly TaxonomyKey[];
  taxonomyPath?: TaxonomyPath;
  currentLevel?: TaxonomyLevel;
  selectedTaxonomyKey?: TaxonomyKey;
  onMobile: boolean;
  setSelectedTaxonomyId: (taxonomyId: string) => void;
  pushToTaxonomyPath: (subject: Subject) => void;
  revertTaxonomyPathTo: (taxonomyLevel: TaxonomyLevel) => void;
}

const learningContext = createContext<LearningContext>({
  taxonomyKeys: undefined,
  taxonomyPath: undefined,
  currentLevel: undefined,
  selectedTaxonomyKey: undefined,
  onMobile: false,
  setSelectedTaxonomyId: () => void null,
  pushToTaxonomyPath: () => void null,
  revertTaxonomyPathTo: () => void null
});

export const useLearningContext = () => useContext(learningContext);

export interface Props {
  onMobile: boolean;
  taxonomyKeysFetcher: TaxonomyKeysFetcher;
  taxonomyRepository: TaxonomyRepository;
  children: ReactNode;
}

export const LearningContextProvider = ({
  onMobile,
  taxonomyKeysFetcher,
  taxonomyRepository,
  children
}: Props) => {
  const [taxonomyKeys, setTaxonomyKeys] = useState<
    readonly TaxonomyKey[] | undefined
  >(undefined);

  const taxonomyKeysById = useMemo<
    ReadonlyMap<string, TaxonomyKey> | undefined
  >(
    () =>
      new Map(taxonomyKeys?.map(taxonomyKey => [taxonomyKey.id, taxonomyKey])),
    [taxonomyKeys]
  );

  const [selectedTaxonomyKey, setSelectedTaxonomyKey] = useState<
    TaxonomyKey | undefined
  >(undefined);

  const [taxonomyPath, setTaxonomyPath] = useState<TaxonomyPath | undefined>(
    undefined
  );

  useEffect(() => {
    let canProcessData = true;

    (async () => {
      try {
        const fetchedTaxonomyKeys = await taxonomyKeysFetcher();

        if (!canProcessData) {
          return;
        }

        validateTaxonomyKeys(fetchedTaxonomyKeys);

        const firstTaxonomyKey = fetchedTaxonomyKeys[0] as TaxonomyKey;

        setTaxonomyKeys(fetchedTaxonomyKeys);
        setSelectedTaxonomyKey(firstTaxonomyKey);
      } catch (err) {
        alert(`Cannot load the taxonomy keys. ${formatError(err)}`);
      }
    })();

    return () => {
      canProcessData = false;
    };
  }, [taxonomyKeysFetcher]);

  const taxonomyPathReference = useRef<TaxonomyPath>();
  taxonomyPathReference.current = taxonomyPath;

  useEffect(() => {
    if (!selectedTaxonomyKey) {
      return;
    }

    let canProcessData = true;

    const oldTaxonomyPath = taxonomyPathReference.current;
    setTaxonomyPath(undefined);

    (async () => {
      try {
        const fetchedTaxonomy = await taxonomyRepository.getByKey(
          selectedTaxonomyKey
        );

        if (!canProcessData) {
          return;
        }

        const newTaxonomyPath = (
          oldTaxonomyPath?.navigateTaxonomy(fetchedTaxonomy) ??
          TaxonomyPath.fromTaxonomy(fetchedTaxonomy)
        ).toMeaningful();

        setTaxonomyPath(newTaxonomyPath);
      } catch (err) {
        alert(
          `Cannot load taxonomy '${selectedTaxonomyKey.name}'. ${formatError(
            err
          )}`
        );
      }
    })();

    return () => {
      canProcessData = false;
    };
  }, [taxonomyRepository, selectedTaxonomyKey]);

  const setSelectedTaxonomyId = useCallback(
    (taxonomyId: string) => {
      const taxonomyKey = taxonomyKeysById?.get(taxonomyId);

      if (!taxonomyKey) {
        throw new Error(`Cannot find taxonomy key having id '${taxonomyId}'`);
      }

      setSelectedTaxonomyKey(taxonomyKey);
    },
    [taxonomyKeysById]
  );

  const pushToTaxonomyPath = useCallback(
    (subject: Subject) => {
      setTaxonomyPath(taxonomyPath?.push(subject).toMeaningful());
    },
    [taxonomyPath]
  );

  const revertTaxonomyPathTo = useCallback(
    (taxonomyLevel: TaxonomyLevel) => {
      setTaxonomyPath(taxonomyPath?.revertTo(taxonomyLevel).toMeaningful());
    },
    [taxonomyPath]
  );

  const contextValue: LearningContext = {
    taxonomyKeys,
    taxonomyPath,
    currentLevel: taxonomyPath?.currentLevel,
    selectedTaxonomyKey,
    onMobile,
    setSelectedTaxonomyId,
    pushToTaxonomyPath,
    revertTaxonomyPathTo
  };

  return (
    <learningContext.Provider value={contextValue}>
      {children}
    </learningContext.Provider>
  );
};
