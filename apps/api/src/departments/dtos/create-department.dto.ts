import { OmitType } from '@nestjs/swagger';
import { DepartmentEntity } from '../entities/department.entity';

export class CreateDepartmentParamsDto extends OmitType(DepartmentEntity, ['id']) {}
