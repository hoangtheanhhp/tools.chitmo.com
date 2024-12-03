<script setup lang="ts">
import { BrandGithub, InfoCircle, Moon, Sun } from '@vicons/tabler';
import { IconBrandGithub, IconBrandX, IconMoon } from '@tabler/icons-vue';
import { useStyleStore } from '@/stores/style.store';

const styleStore = useStyleStore();
const { isDarkTheme } = toRefs(styleStore);
</script>

<template>
  <c-tooltip :tooltip="$t('home.nav.github')" position="bottom">
    <c-button
      circle
      variant="text"
      href="https://github.com/hoangtheanhhp/it-tools"
      target="_blank"
      rel="noopener noreferrer"
      :aria-label="$t('home.nav.githubRepository')"
    >
      <n-icon size="25" :component="IconBrandGithub" />
    </c-button>
  </c-tooltip>

  <c-tooltip :tooltip="$t('home.nav.twitterX')" position="bottom">
    <c-button
      circle
      variant="text"
      href="https://x.com/hoangtheanhhp"
      rel="noopener"
      target="_blank"
      :aria-label="$t('home.nav.twitterXAccount')"
    >
      <n-icon size="25" :component="IconBrandX" />
    </c-button>
  </c-tooltip>

  <c-tooltip :tooltip="$t('home.nav.chitmo')" position="bottom">
    <c-button
      circle
      variant="text"
      href="https://chitmo.com"
      rel="noopener"
      target="_blank"
      :aria-label="$t('home.nav.twitterAccount')"
    >
      <n-icon size="25" :component="InfoCircle" />
    </c-button>
  </c-tooltip>
  <c-tooltip :tooltip="isDarkTheme ? $t('home.nav.lightMode') : $t('home.nav.darkMode')" position="bottom">
    <c-button circle variant="text" :aria-label="$t('home.nav.mode')" @click="() => styleStore.toggleDark()">
      <n-icon v-if="isDarkTheme" size="25" :component="IconSun" />
      <n-icon v-else size="25" :component="IconMoon" />
    </c-button>
  </c-tooltip>
</template>

<style lang="less" scoped>
.n-button {
  &:not(:last-child) {
    margin-right: 5px;
  }
}
</style>
