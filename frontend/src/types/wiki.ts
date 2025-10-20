export type WikiSection = {
  path: string;
  label: string;
  icon: string;
};

export type WikiBall = {
  slug: string;
  name: string | null;
  description: string | null;
  imageUrl: string | null;
  type: 'pure' | 'fusion' | 'evolution' | null;
  tags: string[];
};

export type WikiBallFusion = {
  slug: string;
  description: string | null;
  result: {
    slug: string;
    name: string | null;
    imageUrl: string | null;
  };
  components: Array<{
    slug: string;
    name: string | null;
    imageUrl: string | null;
  }>;
};

export type WikiBallEvolution = {
  slug: string;
  description: string | null;
  result?: {
    slug: string;
    name: string | null;
    imageUrl: string | null;
  };
  base?: {
    slug: string;
    name: string | null;
    imageUrl: string | null;
  };
  imageUrl?: string | null;
};

export type WikiBallDetail = WikiBall & {
  fusionsFrom: WikiBallFusion[];
  fusionsInto: Array<{
    slug: string;
    result: {
      slug: string;
      name: string | null;
      imageUrl: string | null;
    };
  }>;
  evolutionsFrom: WikiBallEvolution[];
  evolutionsInto: WikiBallEvolution[];
};

export type WikiFusion = {
  slug: string;
  description: string | null;
  result: {
    slug: string;
    name: string | null;
    imageUrl: string | null;
  };
  components: Array<{
    slug: string;
    name: string | null;
    imageUrl: string | null;
  }>;
};

export type WikiEvolution = {
  slug: string;
  description: string | null;
  imageUrl?: string | null;
  base: {
    slug: string;
    name: string | null;
    imageUrl: string | null;
  };
  result: {
    slug: string;
    name: string | null;
    imageUrl: string | null;
  };
};

export type WikiCharacter = {
  slug: string;
  name: string | null;
  description: string | null;
  imageUrl: string | null;
  startingBall: string | null;
  unlockRequirement: string | null;
};

export type WikiItem = {
  slug: string;
  name: string | null;
  description: string | null;
  imageUrl: string | null;
  type: string | null;
};

export type WikiPassive = {
  id: number;
  name: string | null;
  description: string | null;
  imageUrl: string | null;
};

export type WikiPassiveEvolution = {
  id: number;
  slug: string;
  components: string[];
  componentsLabel: string;
  result: string | null;
};
