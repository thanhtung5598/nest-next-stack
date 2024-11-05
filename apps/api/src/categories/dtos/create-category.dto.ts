import { OmitType } from '@nestjs/swagger';
import { CategoryEntity } from '../entities/category.entity';

export class CreateCategoryParamsDto extends OmitType(CategoryEntity, ['id']) {}
