<script setup lang="ts">
import { ref } from 'vue';
import { watchEffect } from 'vue';
import { isKatakana, toHiragana, toKatakana } from 'wanakana';
import TextareaCopyable from '@/components/TextareaCopyable.vue';
import kuromoji, {builder, Tokenizer, TokenizerBuilder, IpadicFeatures } from 'kuromoji-fedora';

// Define reactive variables with appropriate types
const input = ref('Input your text here');
const output = ref('');
const conversionType = ref<'fullwidth-to-halfwidth' | 'halfwidth-to-fullwidth' | 'hiragana-to-katakana' | 'katakana-to-hiragana' | 'alphabet-to-katakana' | 'katakana-to-alphabet' | 'alphabet-to-hiragana' | 'hiragana-to-alphabet' | 'normalize' | 'kanji-to-hiragana' | 'kanji-to-katakana'>('fullwidth-to-halfwidth');
const processing = ref(false);
const builder: TokenizerBuilder<IpadicFeatures> = kuromoji.builder({ dicPath: '/dict' });

// Initialize Kuromoji tokenizer
let tokenizer: Tokenizer<IpadicFeatures> | null = null;
builder.build((err, builtTokenizer) => {
  if (err) {
    console.error('Error loading kuromoji:', err);
    return;
  }
  tokenizer = builtTokenizer;
});

// Conversion functions
function convertKanjiToHiragana(text: string): string {
  if (!tokenizer) {
    console.error('Kuromoji tokenizer is not ready.');
    return text;
  }
  const tokens = tokenizer.tokenize(text);
  return tokens.map(token => token.reading ? toHiragana(token.reading) : token.surface_form).join(' ');
}

function convertKanjiToKatakana(text: string): string {
  if (!tokenizer) {
    console.error('Kuromoji tokenizer is not ready.');
    return text;
  }
  const tokens = tokenizer.tokenize(text);
  return tokens.map(token => token.reading ? toKatakana(token.reading) : token.surface_form).join(' ');
}

function convertFullwidthToHalfwidth(text: string): string {
  return text.replace(/[\uFF01-\uFF5E]/g, ch =>
    String.fromCharCode(ch.charCodeAt(0) - 0xFEE0),
  ).replace(/\u3000/g, ' '); // Replace full-width space with half-width space
}

function convertHalfwidthToFullwidth(text: string): string {
  return text.replace(/[!-~]/g, ch =>
    String.fromCharCode(ch.charCodeAt(0) + 0xFEE0),
  ).replace(/ /g, '\u3000'); // Replace half-width space with full-width space
}

function convertHiraganaToKatakana(text: string): string {
  return toKatakana(text);
}

function convertKatakanaToHiragana(text: string): string {
  return toHiragana(text);
}

function convertAlphabetToKatakana(text: string): string {
  return toKatakana(text);
}

function convertKatakanaToAlphabet(text: string): string {
  return isKatakana(text) ? text.replace(/[\u30A1-\u30F6]/g, ch => String.fromCharCode(ch.charCodeAt(0) - 0x60)) : text;
}

function convertAlphabetToHiragana(text: string): string {
  return toHiragana(text);
}

function convertHiraganaToAlphabet(text: string): string {
  return toKatakana(text); // Example logic, you may need a custom implementation
}

function normalizeText(text: string): string {
  return text.normalize();
}

// Watch effect for handling conversion
watchEffect(() => {
  processing.value = true;
  try {
    switch (conversionType.value) {
      case 'fullwidth-to-halfwidth':
        output.value = convertFullwidthToHalfwidth(input.value);
        break;
      case 'halfwidth-to-fullwidth':
        output.value = convertHalfwidthToFullwidth(input.value);
        break;
      case 'hiragana-to-katakana':
        output.value = convertHiraganaToKatakana(input.value);
        break;
      case 'katakana-to-hiragana':
        output.value = convertKatakanaToHiragana(input.value);
        break;
      case 'alphabet-to-katakana':
        output.value = convertAlphabetToKatakana(input.value);
        break;
      case 'katakana-to-alphabet':
        output.value = convertKatakanaToAlphabet(input.value);
        break;
      case 'alphabet-to-hiragana':
        output.value = convertAlphabetToHiragana(input.value);
        break;
      case 'hiragana-to-alphabet':
        output.value = convertHiraganaToAlphabet(input.value);
        break;
      case 'normalize':
        output.value = normalizeText(input.value);
        break;
      case 'kanji-to-hiragana':
        output.value = convertKanjiToHiragana(input.value);
        break;
      case 'kanji-to-katakana':
        output.value = convertKanjiToKatakana(input.value);
        break;
      default:
        output.value = input.value;
    }
  }
  catch (e: any) {
    console.error('Error in conversion:', e);
  }
  processing.value = false;
});

function swapConversionType() {
  const temp = input.value;
  input.value = output.value;
  output.value = temp;
}
</script>

<template>
  <c-card style="max-width: 600px;">
    <c-input-text v-model:value="input" label="Your text:" placeholder="Enter text" raw-text multiline rows="4" />

    <n-divider />

    <n-grid cols="3" x-gap="12" w-full>
      <n-gi span="2">
        <c-select
          v-model:value="conversionType" label-position="top" label="Conversion Type:" :options="[
            { label: 'Alphabet to Hiragana', value: 'alphabet-to-hiragana' },
            { label: 'Alphabet to Katakana', value: 'alphabet-to-katakana' },
            { label: 'Fullwidth to Halfwidth', value: 'fullwidth-to-halfwidth' },
            { label: 'Halfwidth to Fullwidth', value: 'halfwidth-to-fullwidth' },
            { label: 'Hiragana to Alphabet', value: 'hiragana-to-alphabet' },
            { label: 'Hiragana to Katakana', value: 'hiragana-to-katakana' },
            { label: 'Kanji to Hiragana', value: 'kanji-to-hiragana' },
            { label: 'Kanji to Katakana', value: 'kanji-to-katakana' },
            { label: 'Katakana to Alphabet', value: 'katakana-to-alphabet' },
            { label: 'Katakana to Hiragana', value: 'katakana-to-hiragana' },
            { label: 'Normalize', value: 'normalize' },
          ]" placeholder="Select conversion type"
        />
      </n-gi>
      <n-gi span="1" display="flex" align="center" justify="center" style="margin: auto;">
        <n-button text @click="swapConversionType">
          <n-icon size="25">
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 20 20">
              <g fill="none">
                <path
                  d="M12.146 3.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L14.293 7H4.5a.5.5 0 0 1 0-1h9.793l-2.147-2.146a.5.5 0 0 1 0-.708zm-4.292 7a.5.5 0 0 1 0 .708L5.707 13H15.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 0 1 .708 0z"
                  fill="currentColor"
                />
              </g>
            </svg>
          </n-icon>
        </n-button>
      </n-gi>
    </n-grid>

    <n-divider />

    <div v-if="processing" flex items-center justify-center>
      <n-spin size="medium" />
      <span class="ml-2">Converting text...</span>
    </div>

    <n-form-item v-if="!processing" label="Converted text:">
      <TextareaCopyable :value="output" mb-1 mt-1 copy-placement="outside" />
    </n-form-item>
  </c-card>
</template>
