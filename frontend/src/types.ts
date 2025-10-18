export type Ball = {
  id: number;
  name: string;
  type: string;
  level: number;
  description: string;
  imageUrl: string;
};

export type Evolution = {
  id: number;
  requiredLevel: number;
  baseBall: Ball;
  evolvedBall: Ball;
};

export type FusionInput = {
  id: number;
  ball: Ball;
};

export type FusionRecipe = {
  id: number;
  requiredLevel: number;
  result: Ball;
  inputs: FusionInput[];
};

export type BallDetail = Ball & {
  evolutionsFrom: Evolution[];
  evolutionsTo: Evolution[];
  fusionInputs: { recipe: FusionRecipe }[];
  fusionResults: FusionRecipe[];
};
