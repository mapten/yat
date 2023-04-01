import { describe, it, expect, vi } from 'vitest';

// Store helper
import { sideEffectsFactory } from '../../../store/helpers/sideEffects.factory';

// Store
import { useConfigurationStore } from '../../../store/configuration.store';

// Side effects
import * as configurationSideEffects from '../../../store/sideEffects/configuration.store.sideeffects';

describe('side effects factory', () => {
  it('should return a function when fullName matches with the factory mapping', () => {
    // arrange
    const mockStoreModeBeforeChange = vi.spyOn(configurationSideEffects, 'storeModeBeforeChange');

    const fullName = 'storeMode.beforeChange';

    expect(mockStoreModeBeforeChange).not.toHaveBeenCalled();

    // act
    sideEffectsFactory(fullName, useConfigurationStore, 'offline');

    // assert
    expect(mockStoreModeBeforeChange).toHaveBeenCalled();
  });
});