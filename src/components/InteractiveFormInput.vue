<template>
  <article
          v-show="isActive || isComplete"
          class="
      position-relative w-100
      flex-column justify-content-center align-items-center
    "
          :class="{
      'active': isActive,
      'complete': isComplete,
      'overflow': isOverflow
    }"
  >
    <label :for="name"><slot /></label>
    <div
      class="box-field"
      :style="{ 'font-size': (isActive) ? `${adjustedFontSize}%` : '100%' }"
    >
      <textarea
        v-if="type === 'textarea'"
        ref="field"
        :name="name"
        :placeholder="placeholder"
        :value="value"
        maxlength="1000"
        minlength="1"
        :rows="rows"
        :pattern="(validation.rule) ? validation.rule : false"
        :style="{ width: `${width}px` }"
        :readonly="isComplete"
        @input="$emit('input', $event.target.value)"
        @change="touched = true"
        @blur="touched = true"
        @keyup="onKeyup($event)"
      />
      <input
        v-else
        ref="field"
        :name="name"
        :type="type"
        :placeholder="placeholder"
        :value="value"
        :pattern="(validation.rule) ? validation.rule : false"
        required
        :style="{ width: `${width}px` }"
        :readonly="isComplete"
        @input="$emit('input', $event.target.value)"
        @change="touched = true"
        @blur="touched = true"
        @keyup="onKeyup($event)"
      >
      <span
        ref="dimensionTest"
        class="dimension-test"
      >
        {{ value || placeholder }}
      </span>
    </div>
    <span
            v-show="isActive && touched && !valid"
            class="message-validation"
    >
      {{ validation.message }}
    </span>
  </article>
</template>

<script lang="ts">
  import {
    Component,
    Vue,
    Prop,
    Watch,
    Ref
  } from 'vue-property-decorator';
  import { UserFieldState } from '@/types';

  @Component
  export default class InteractiveFormInput extends Vue {
    @Ref('dimensionTest') dimensionTest!: HTMLSpanElement;

    @Ref('field') field!: HTMLInputElement | HTMLTextAreaElement;

    @Prop({ default: UserFieldState.INITIAL }) state!: UserFieldState;

    @Prop({ required: true }) name!: string;

    @Prop({ default: 'text' }) type!: string;

    @Prop() validation!: { rule: RegExp, message: string };

    @Prop() value!: string;

    valid: boolean = false;

    touched: boolean = false;

    fieldWidth: number = 0;

    rowCount: number = 3;

    updated() {
      this.fieldWidth = this.dimensionTest.clientWidth;
    }

    mounted() {
      this.onStateChange(this.state);
    }

    @Watch('value')
    onValueChange() {
      this.valid = this.field.checkValidity();
      if (this.type === 'textarea' && this.$el) {
        const field = this.field as HTMLTextAreaElement;

        this.rowCount = Math.ceil(this.fieldWidth / (this.$el.clientWidth * 0.85));
        this.valid = field.textLength < field.maxLength;
        if (!this.valid && !this.touched) {
          this.touched = true;
        }
      }
      this.$emit('valid', this.valid);
    }

    @Watch('state')
    onStateChange(state: any) {
      if (state == UserFieldState.ACTIVE) {
        this.$emit('valid', this.valid);
        this.$nextTick(() => this.field.focus());
      }
    }

    onKeyup(event: KeyboardEvent) {
      if (event.key === 'Enter' && this.type !== 'textarea') {
        event.preventDefault();
        event.stopPropagation();
        if (this.valid) {
          this.$emit('completed');
        } else {
          this.touched = true;
          this.$emit('valid', false);
        }
      }
    }

    get width() {
      return this.fieldWidth;
    }

    get isInitial() {
      return this.state === UserFieldState.INITIAL;
    }

    get isActive() {
      return this.state === UserFieldState.ACTIVE;
    }

    get isComplete() {
      return this.state === UserFieldState.COMPLETE;
    }

    get isOverflow(): boolean {
      return this.rowCount > 7;
    }

    get adjustedFontSize(): number {
      return (this.type === 'textarea')
        ? 100 - (60 * (this.value.length / 1000))
        : 100 - (50 * (this.value.length / 40));
    }

    get rows(): number {
      const rows = Math.max(this.rowCount, 3);

      return Math.min(rows, 6);
    }

    get placeholder(): string {
      let placeholder = '';

      if (this.$slots.default) {
        placeholder = (this.$slots.default[0].text || '').trim();
      }
      return placeholder;
    }
  }
</script>

<style lang="scss" scoped>
  input,
  textarea,
  .dimension-test {
    display: block;
    box-sizing: content-box;
    background: transparent !important;
    border: none;
    outline: none;
    max-width: 100%;
    font-family: $serif;
    font-size: 4em;
    line-height: 1.25;
    letter-spacing: -0.42px;
    caret-color: $red;
  }

  input,
  textarea {
    min-width: 1em;
    max-width: 100%;
    color: $white !important;
    transition: font-size 200ms ease-out;

    &::placeholder {
      opacity: 0.35;
    }
  }

  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  input:-webkit-autofill:active {
    color: $white !important;
    -webkit-text-fill-color: $white !important;
    background-color: transparent !important;
    background-image: none !important;
    -webkit-box-shadow: 0 0 0 1000px $midnight inset;
    width: min-content;
    border-radius: 0;
    -webkit-transition-delay: 9999s;
  }

  textarea {
    line-height: 1.33;
    text-align: center;
    resize: none;
    overflow: hidden;

    &:placeholder-shown {
      text-align: left;
    }
  }

  .dimension-test {
    position: absolute;
    top: -100%;
    left: -100%;
    visibility: hidden;
    padding: 0 0.1em;
    max-width: 1000%;
    white-space: nowrap;
  }

  label {
    display: block;
    visibility: hidden;
    margin: 0 0 0.625em;
    font-family: $sans-serif;
    font-size: 1em;
    line-height: 1.5;
    font-weight: 300;
    color: $white;
    text-transform: uppercase;
    z-index: 2;
  }

  .message-validation {
    margin: 1em 0 0;
    font-family: $sans-serif;
    font-size: 0.875em;
    line-height: 1.5;
    color: $red;
    transition: opacity 500ms, height 500ms;

    &::before {
      content: ' ';
      vertical-align: middle;
      display: inline-block;
      margin: 0 0.75em 0.3125em 0;
      width: 1.25em;
      height: 1.25em;
      // background: no-repeat center / contain url('/img/global/icon-alert2x.png');
    }
  }

  .box-field {
    max-width: 100%;
    text-align: center;
  }

  article {
    display: flex;

    &.active {
      flex-grow: 1;
    }

    &.complete {
      margin: 0 0 2em;

      label {
        visibility: visible;
      }

      input,
      textarea {
        min-height: 2em;
        font-size: 2em;
        line-height: 1.1875;
        text-align: center;

        &::placeholder {
          color: transparent;
        }
      }

      textarea {
        height: 100%;
        overflow: hidden;
      }

      &.overflow::after {
        top: unset;
        bottom: -3px;
        background: linear-gradient(to top, $midnight 0%, transparent 100%);
      }
    }

    &.overflow::after {
      content: ' ';
      position: absolute;
      top: 2em;
      left: 0;
      display: block;
      width: 100%;
      height: 15%;
      background: linear-gradient(to bottom, $midnight 0%, transparent 100%);
      z-index: 1;
    }

    &:last-of-type {
      &.active {
        height: unset;
      }

      &.complete {
        justify-content: flex-start;
        flex-grow: 1;
        padding-bottom: unset;
      }
    }
  }
</style>
