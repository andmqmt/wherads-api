import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../../../../common/decorators/current-user.decorator.js';
import { JwtAuthGuard } from '../../../auth/presentation/guards/jwt-auth.guard.js';
import { CreateCampaignDto } from '../../application/dtos/create-campaign.dto.js';
import { UpdateCampaignDto } from '../../application/dtos/update-campaign.dto.js';
import { CreateCampaignUseCase } from '../../application/use-cases/create-campaign.use-case.js';
import { DeleteCampaignUseCase } from '../../application/use-cases/delete-campaign.use-case.js';
import { GetCampaignUseCase } from '../../application/use-cases/get-campaign.use-case.js';
import { ListCampaignsUseCase } from '../../application/use-cases/list-campaigns.use-case.js';
import { UpdateCampaignUseCase } from '../../application/use-cases/update-campaign.use-case.js';

@ApiTags('Campaigns')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('campaigns')
export class CampaignController {
  constructor(
    private readonly listCampaignsUseCase: ListCampaignsUseCase,
    private readonly getCampaignUseCase: GetCampaignUseCase,
    private readonly createCampaignUseCase: CreateCampaignUseCase,
    private readonly updateCampaignUseCase: UpdateCampaignUseCase,
    private readonly deleteCampaignUseCase: DeleteCampaignUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Listar campanhas do usuário' })
  @ApiResponse({ status: 200, description: 'Lista de campanhas' })
  async list(@CurrentUser() user: { userId: string }) {
    return this.listCampaignsUseCase.execute(user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter campanha por ID' })
  @ApiResponse({ status: 200, description: 'Campanha encontrada' })
  @ApiResponse({ status: 404, description: 'Campanha não encontrada' })
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user: { userId: string },
  ) {
    return this.getCampaignUseCase.execute(id, user.userId);
  }

  @Post()
  @ApiOperation({ summary: 'Criar nova campanha' })
  @ApiResponse({ status: 201, description: 'Campanha criada' })
  async create(
    @Body() dto: CreateCampaignDto,
    @CurrentUser() user: { userId: string },
  ) {
    return this.createCampaignUseCase.execute(dto, user.userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar campanha' })
  @ApiResponse({ status: 200, description: 'Campanha atualizada' })
  @ApiResponse({ status: 404, description: 'Campanha não encontrada' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateCampaignDto,
    @CurrentUser() user: { userId: string },
  ) {
    return this.updateCampaignUseCase.execute(id, dto, user.userId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Deletar campanha' })
  @ApiResponse({ status: 204, description: 'Campanha deletada' })
  @ApiResponse({ status: 404, description: 'Campanha não encontrada' })
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: { userId: string },
  ) {
    await this.deleteCampaignUseCase.execute(id, user.userId);
  }
}
