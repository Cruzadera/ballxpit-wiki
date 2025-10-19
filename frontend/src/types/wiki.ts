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
  isPure: boolean;
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
};

export type WikiBallDetail = WikiBall & {
  fusionRecipes: WikiBallFusion[];
  fusionAppearances: Array<{
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
  title: string | null;
};

export type WikiItem = {
  slug: string;
  name: string | null;
  description: string | null;
  imageUrl: string | null;
  type: string | null;
};
