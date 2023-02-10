import { PartialType } from '@nestjs/mapped-types';
import { CreateTradeDatumDto } from './create-trade-datum.dto';

export class UpdateTradeDatumDto extends PartialType(CreateTradeDatumDto) {
  id: number;
}
