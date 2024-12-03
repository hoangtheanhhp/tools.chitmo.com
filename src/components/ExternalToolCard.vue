<script setup lang="ts">
import { useThemeVars } from 'naive-ui';
import FavoriteButton from './FavoriteButton.vue';
import type { Tool } from '@/tools/tools.types';

const props = defineProps<{ tool: Tool & { category: string; externalUrl?: string } }>();
const { tool } = toRefs(props);
const theme = useThemeVars();
</script>

<template>
  <a :href="tool.value.externalUrl" target="_blank" rel="noopener noreferrer" class="decoration-none">
    <c-card class="h-full transition transition-duration-0.5s !border-2px !hover:border-primary">
      <div flex items-center justify-between>
        <n-icon class="text-neutral-400 dark:text-neutral-600" size="40" :component="tool.value.icon" />

        <div flex items-center gap-8px>
          <div
            v-if="tool.value.isNew"
            class="rounded-full px-8px py-3px text-xs text-white dark:text-neutral-800"
            :style="{
              'background-color': theme.primaryColor,
            }"
          >
            {{ $t('toolCard.new') }}
          </div>

          <FavoriteButton :tool="tool.value" />
        </div>
      </div>

      <div class="my-5px truncate text-lg text-black dark:text-white">
        {{ tool.value.name }}
      </div>

      <div class="line-clamp-2 text-neutral-500 dark:text-neutral-400">
        {{ tool.value.description }}
      </div>
    </c-card>
  </a>
</template>
