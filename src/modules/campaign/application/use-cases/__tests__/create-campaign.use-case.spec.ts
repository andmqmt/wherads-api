import { CampaignEntity } from '../../../domain/entities/campaign.entity.js';
import { CampaignRepository } from '../../../domain/repositories/campaign.repository.js';
import { CreateCampaignUseCase } from '../create-campaign.use-case.js';

describe('CreateCampaignUseCase', () => {
  let useCase: CreateCampaignUseCase;
  let campaignRepository: jest.Mocked<CampaignRepository>;

  const mockCampaign = new CampaignEntity({
    id: 'uuid-1',
    name: 'Campanha Teste',
    description: 'Descrição teste',
    status: 'DRAFT',
    budget: 5000,
    startDate: null,
    endDate: null,
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

    useCase = new CreateCampaignUseCase(campaignRepository);
  });

  it('deve criar uma campanha com sucesso', async () => {
    campaignRepository.create.mockResolvedValue(mockCampaign);

    const result = await useCase.execute(
      { name: 'Campanha Teste', description: 'Descrição teste', budget: 5000 },
      'user-1',
    );

    expect(result.name).toBe('Campanha Teste');
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(campaignRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Campanha Teste', userId: 'user-1' }),
    );
  });

  it('deve definir valores padrão para campos opcionais', async () => {
    campaignRepository.create.mockResolvedValue(mockCampaign);

    await useCase.execute({ name: 'Mínima' }, 'user-1');

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(campaignRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        description: null,
        budget: 0,
        startDate: null,
        endDate: null,
      }),
    );
  });
});
