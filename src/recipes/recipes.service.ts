import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { NewRecipeInput } from './dto/new-recipe.input';
import { RecipesArgs } from './dto/recipes.args';
import { Recipe } from './recipe.entity';

@Injectable()
export class RecipesService {
  constructor(
    @InjectRepository(Recipe)
    private readonly recipesRepository: Repository<Recipe>,
  ) {}

  async create(newRecipeInput: NewRecipeInput): Promise<Recipe> {
    const recipe = new Recipe();
    recipe.title = newRecipeInput.title;
    recipe.description = newRecipeInput.description;
    recipe.ingredients = newRecipeInput.ingredients;
    recipe.createdAt = new Date();
    return this.recipesRepository.save(recipe);
  }

  async findOneById(id: string): Promise<Recipe> {
    return this.recipesRepository.findOne(id);
  }

  async findAll(recipesArgs: RecipesArgs): Promise<Recipe[]> {
    return this.recipesRepository.find(recipesArgs);
  }

  async remove(id: string): Promise<DeleteResult> {
    const result = await this.recipesRepository.delete(id);
    return result;
  }
}