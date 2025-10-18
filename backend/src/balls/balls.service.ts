import { Injectable, NotFoundException } from '@nestjs/common';
import type { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BallsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.ball.findMany({
      orderBy: { name: 'asc' }
    });
  }

  async findOne(id: number) {
    const ball = await this.prisma.ball.findUnique({ where: { id } });

    if (!ball) {
      throw new NotFoundException(`Ball with id ${id} not found`);
    }

    const [evolutionsFrom, evolutionsTo, fusionInputs, fusionResults] = await Promise.all([
      this.prisma.evolution.findMany({
        where: { baseBallId: id },
        include: { evolvedBall: true }
      }),
      this.prisma.evolution.findMany({
        where: { evolvedBallId: id },
        include: { baseBall: true }
      }),
      this.prisma.fusionRecipe.findMany({
        where: {
          inputs: {
            some: { ballId: id }
          }
        },
        include: {
          result: true,
          inputs: {
            include: {
              ball: true
            }
          }
        }
      }),
      this.prisma.fusionRecipe.findMany({
        where: { resultId: id },
        include: {
          result: true,
          inputs: {
            include: {
              ball: true
            }
          }
        }
      })
    ]);

    type FusionRecipeWithRelations = Prisma.FusionRecipeGetPayload<{
      include: {
        result: true;
        inputs: {
          include: {
            ball: true;
          };
        };
      };
    }>;

    type FusionInputBall = NonNullable<
      FusionRecipeWithRelations['inputs'][number]['ball']
    >;

    const fusionResultsWithRelations = fusionResults as FusionRecipeWithRelations[];
    const fusionInputsWithRelations = fusionInputs as FusionRecipeWithRelations[];

    const mappedFusionResults = fusionResultsWithRelations.map((recipe) => ({
      id: recipe.id,
      requiredLevel: recipe.requiredLevel,
      origenA: recipe.origenA,
      origenB: recipe.origenB,
      resultado: recipe.resultado,
      descripcion: recipe.descripcion,
      emoji: recipe.emoji,
      tipo: recipe.tipo,
      result: recipe.result,
      inputs: recipe.inputs
        .map(({ ball }) => ball)
        .filter((inputBall): inputBall is FusionInputBall => Boolean(inputBall))
    }));

    type ComponentBall = {
      id: number;
      name?: string | null;
      nombre?: string | null;
      description?: string | null;
      descripcion?: string | null;
    };

    const componentesById = new Map<number, ComponentBall>();
    const componentesByName = new Map<string, ComponentBall>();
    const orderedNameSet = new Set<string>();
    const orderedNames: string[] = [];

    const addComponentName = (rawName?: string | null) => {
      if (!rawName) {
        return;
      }

      const trimmed = rawName.trim();
      if (!trimmed) {
        return;
      }

      if (!orderedNameSet.has(trimmed)) {
        orderedNameSet.add(trimmed);
        orderedNames.push(trimmed);
      }
    };

    const registerComponent = (component: ComponentBall) => {
      if (componentesById.has(component.id)) {
        return;
      }

      componentesById.set(component.id, component);

      const registerByName = (rawName?: string | null) => {
        if (!rawName) {
          return;
        }

        const trimmed = rawName.trim();
        if (!trimmed) {
          return;
        }

        if (!componentesByName.has(trimmed)) {
          componentesByName.set(trimmed, component);
        }
      };

      registerByName(component.name);
      registerByName(component.nombre);
    };

    mappedFusionResults.forEach((recipe) => {
      recipe.inputs.forEach((inputBall) => {
        registerComponent({
          id: inputBall.id,
          name: inputBall.name,
          nombre: (inputBall as unknown as { nombre?: string | null })?.nombre ?? null,
          description: inputBall.description,
          descripcion: (inputBall as unknown as { descripcion?: string | null })?.descripcion ?? null
        });

        addComponentName(inputBall.name);
        addComponentName(
          (inputBall as unknown as { nombre?: string | null })?.nombre ?? undefined
        );
      });

      [recipe.origenA, recipe.origenB]
        .filter((value): value is string => Boolean(value))
        .forEach((value) => {
          value
            .split('+')
            .map((part) => part.trim())
            .filter((part) => part.length > 0)
            .forEach((name) => addComponentName(name));
        });
    });

    const namesToLookup = orderedNames.filter(
      (name) => !componentesByName.has(name)
    );

    if (namesToLookup.length > 0) {
      const fallbackComponents = await this.prisma.ball.findMany({
        where: {
          name: {
            in: namesToLookup
          }
        },
        select: {
          id: true,
          name: true,
          description: true
        }
      });

      fallbackComponents.forEach((component) => {
        registerComponent({
          id: component.id,
          name: component.name,
          description: component.description ?? null
        });
      });
    }

    const orderedComponentes = orderedNames
      .map((name) => componentesByName.get(name))
      .filter((component): component is ComponentBall => Boolean(component));

    const componentes = orderedComponentes.length
      ? [
          ...orderedComponentes,
          ...Array.from(componentesById.values()).filter(
            (component) =>
              !orderedComponentes.some(
                (orderedComponent) => orderedComponent.id === component.id
              )
          )
        ]
      : Array.from(componentesById.values());

    return {
      ...ball,
      evolutionsFrom,
      evolutionsTo,
      fusionInputs: fusionInputsWithRelations.map((recipe) => ({
        id: recipe.id,
        requiredLevel: recipe.requiredLevel,
        origenA: recipe.origenA,
        origenB: recipe.origenB,
        resultado: recipe.resultado,
        descripcion: recipe.descripcion,
        emoji: recipe.emoji,
        tipo: recipe.tipo,
        result: recipe.result,
        inputs: recipe.inputs.map(({ ball }) => ball)
      })),
      fusionResults: mappedFusionResults,
      componentes
    };
  }
}
