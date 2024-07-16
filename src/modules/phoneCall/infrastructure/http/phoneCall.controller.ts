import { ApiHeaders, ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import { serviceRegistryHeaders } from '../../../../assets/serviceRegistryHeadersObject.json';

// Domain
import { ILogger } from '../../../shared/domain/Logger';

// Application
import { MakeCall } from '../../application/useCases/MakeCall';
import { GetAllPhoneCall } from '../../application/useCases/GetAllPhoneCall';

// Infrastructure
import { MakeCallDto } from './dto/makeCall.dto';
import { MakeCallResponseDto } from './dto/makeCallResponse.dto';
import { SearchShippingGroupIdDto } from './dto/searchShippingGroupId.dto';
import { PhoneCallDto } from './dto/phoneCall.dto';

@ApiTags('phoneCall')
@ApiHeaders(serviceRegistryHeaders)
@Controller('phoneCall')
export class PhoneCallController {
  constructor(
    private readonly logger: ILogger,
    private readonly makePhoneCall: MakeCall,
    private readonly useCaseGetAllPhoneCall: GetAllPhoneCall,
  ) {}

  @Get('')
  async getAllByShippingGroup(
    @Query() params: SearchShippingGroupIdDto,
  ): Promise<PhoneCallDto[]> {
    try {
      return await this.useCaseGetAllPhoneCall.execute(params);
    } catch (error) {
      this.logger.error('Error to hit getAllByShippingGroup', { ...error });
      throw error;
    }
  }

  @Post('makeCall')
  @HttpCode(HttpStatus.OK)
  async makeCall(@Body() params: MakeCallDto): Promise<MakeCallResponseDto> {
    try {
      return await this.makePhoneCall.execute(params);
    } catch (error) {
      this.logger.error('Error to hit makeCall', { ...error });
      throw error;
    }
  }
}
