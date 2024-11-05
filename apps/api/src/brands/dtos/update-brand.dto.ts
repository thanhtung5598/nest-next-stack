import { OmitType, PartialType } from '@nestjs/swagger';
import { BrandEntity } from '../entities/brand.entity';

export class UpdateBrandParamsDto extends PartialType(OmitType(BrandEntity, ['id'])) {}
