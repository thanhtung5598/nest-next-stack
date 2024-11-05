import { OmitType } from '@nestjs/swagger';
import { BrandEntity } from '../entities/brand.entity';

export class CreateBrandParamsDto extends OmitType(BrandEntity, ['id']) {}
