import { OmitType, PartialType } from '@nestjs/swagger';
import { CategoryEntity } from '../entities/category.entity';

export class UpdateCategoryParamsDto extends PartialType(OmitType(CategoryEntity, ['id'])) {}
