import sharpImageService from 'astro/assets/services/sharp';
import type { LocalImageService, ImageTransform } from 'astro';

// Enforce maximum width of 2 * 704 = 1408px
const MAX_WIDTH = 2 * 704;

const customImageService: LocalImageService = {
  ...sharpImageService,
  validateOptions(options, imageConfig) {
    if (!sharpImageService.validateOptions) {
      return options;
    }
    const validated = sharpImageService.validateOptions(options, imageConfig) as ImageTransform;

    if (validated.width && validated.width > MAX_WIDTH) {
      const ratio = MAX_WIDTH / validated.width;
      validated.width = MAX_WIDTH;
      if (validated.height) {
        validated.height = Math.round(validated.height * ratio);
      }
    }

    return validated;
  },
};

export default customImageService;
