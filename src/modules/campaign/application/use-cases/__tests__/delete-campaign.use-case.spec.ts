import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { CampaignEntity } from '../../../domain/entities/campaign.entity.js';
import { CampaignRepository } from '../../../domain/repositories/campaign.repository.js';
import { DeleteCampaignUseCase } from '../delete-campaign.use-case.js';

describe('DeleteCampaignUseCase', () => {
  let useCase: DeleteCampaignUseCase;
  let campaignRepository: jest.Mocked<CampaignRepository>;

  const mockCampaign = new CampaignEntity({
    id: 'uuid-1',
    name: 'Campanha',
    status: 'DRAFT',
    budget: 0,
    userId: 'user-1',
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  beforeEach(() => {
    campaignRepository = {
      findAllByUserId: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as jest.Mocked<CampaignRepository>;

    useCase = new DeleteCampaignUseCase(campaignRepository);
  });

  it('deve deletar uma campanha com sucesso', async () => {
    campaignRepository.findById.mockResolvedValue(mockCampaign);
    campaignRepository.delete.mockResolvedValue();

    await useCase.execute('uuid-1', 'user-1');

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(campaignRepository.delete).toHaveBeenCalledWith('uuid-1');
  });

  it('deve lançar NotFoundException se campanha não existe', async () => {
    campaignRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute('nao-existe', 'user-1')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('deve lançar ForbiddenException se usuário não é dono', async () => {
    campaignRepository.findById.mockResolvedValue(mockCampaign);

    await expect(useCase.execute('uuid-1', 'outro-user')).rejects.toThrow(
      ForbiddenException,
    );
  });
});
