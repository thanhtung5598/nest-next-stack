import { OmitType, PartialType } from '@nestjs/swagger';
import { DepartmentEntity } from '../entities/department.entity';

export class UpdateDepartmentParamsDto extends PartialType(OmitType(DepartmentEntity, ['id'])) {}
