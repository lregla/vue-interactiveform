<template>
  <section
          class="
      section-contact-form position-relative w-100 h-100
      d-flex flex-column justify-content-center align-items-center
    "
  >
    <circle-background ref="background" />
    <div
            class="
        box-form-container position-relative mx-auto w-100 h-100
        d-flex flex-column justify-content-center align-items-center
      "
            :class="{ 'active': mode != 0 }"
    >
      <form
              v-show="mode == 1"
              ref="form"
              method="post"
              action="/contact-us"
              class="
          position-relative mx-auto p-0 w-100
          flex-column align-items-center
        "
      >
        <form-input
                ref="fieldName"
                v-model="name"
                :state="getState(0)"
                name="name"
                :validation="{
            message: 'Please enter a name.'
          }"
                @valid="isNext = $event"
                @completed="step++"
        >
          Name
        </form-input>
        <form-input
                ref="fieldEmail"
                v-model="email"
                :state="getState(1)"
                name="email"
                type="email"
                :validation="{
            message: 'Please enter a valid email.'
          }"
                @valid="isNext = $event"
                @completed="step++"
        >
          Email
        </form-input>
        <form-input
                ref="fieldMessage"
                v-model="message"
                :state="getState(2)"
                name="message"
                type="textarea"
                :validation="{
            message: 'You\'ve reached the max message length'
          }"
                @valid="isNext = $event"
                @completed="onCompleted"
        >
          Message
        </form-input>
      </form>
      <menu
              v-show="mode == 1"
              class="
          position-absolute m-0 p-0
          justify-content-center align-items-center
        "
      >
        <button
                v-if="step > 0"
                class="primary-cta primary-cta-white button-back"
                @click="step--"
        >
          Back
        </button>
        <button
                v-if="step < 2"
                class="primary-cta primary-cta-white button-next"
                :disabled="!isNext"
                @click="step++"
        >
          Next
        </button>
        <button
                v-if="step == 2"
                ref="submitButton"
                class="primary-cta primary-cta-white button-submit"
                :disabled="!isNext"
                @click="step++; onSubmit()"
        >
          Submit
        </button>
      </menu>
      <div
              class="box-success-message"
              :class="{ 'display': mode == 5 }"
      >
        <span class="eyebrow">Your message has been sent</span>
        <span>We will be in touch within the next 48 hours.</span>
      </div>
      <div
              class="box-error-message"
              :class="{'display': mode == 4 }"
      >
        <span class="eyebrow">Error</span>
        <span>Your message was not sent.</span>
      </div>
    </div>
    <button
            class="button-cancel"
            @click="onClose"
    >
      cancel
    </button>
  </section>
</template>

<script lang="ts">
  import {
    Component,
    Ref,
    Prop,
    Vue,
    Watch
  } from 'vue-property-decorator';
  import InteractiveFormInput from './InteractiveFormInput.vue';
  import { UserFormState, UserFieldState } from '@/types';

  @Component({
    components: { 'form-input': InteractiveFormInput }
  })
  export default class InteractiveForm extends Vue {
    @Ref('form') form!: HTMLFormElement;

    @Ref('submitButton') submitButton!: HTMLButtonElement;

    @Ref('background') background!: Vue;

    @Prop({ default: { x: 300, y: 300 } }) position!: { x: number, y: number };

    mode: UserFormState = UserFormState.INACTIVE;

    step: number = 0;

    isNext: boolean = false;

    name: string = '';

    email: string = '';

    message: string = '';

    mounted() {
      // @ts-ignore-next-line
      this.background.position = this.position;
      this.mode = UserFormState.ACTIVE;
    }

    @Watch('step')
    onStep() {
      this.isNext = false;
    }

    @Watch('mode')
    onChangeMode(mode: any) {
      // @ts-ignore-next-line
      this.background.active = mode !== UserFormState.INACTIVE;
    }

    onCompleted() {
      this.submitButton.classList.toggle('attract', true);
    }

    async onSubmit() {
      const formData: FormData = new FormData();

      formData.set('name', this.name);
      formData.set('email', this.email);
      formData.set('message', this.message);
      // axios({
      //     method: 'post',
      //     url: this.form.action,
      //     data: formData,
      //     headers: { 'Content-Type': 'multipart/form-data' }
      // })
      //     .then(this.onSuccess)
      //     .catch(this.onError);
    }

    onReset() {
      this.name = '';
      this.email = '';
      this.message = '';
      this.step = 0;
      this.mode = UserFormState.ACTIVE;
    }

    onSuccess() {
      this.form.classList.toggle('zoom', true);
      // gsap.to(this.form, {
      //     y: '-100vh',
      //     duration: 1,
      //     delay: 1,
      //     onComplete: () => {
      //         this.mode = UserFormState.SUCCESS;
      //     }
      // });
    }

    onError() {
      this.mode = UserFormState.ERROR;
      setTimeout(this.onReset, 5000);
    }

    onClose() {
      this.mode = UserFormState.INACTIVE;
      this.background.$on('animationend', () => {
        this.$emit('close');
      });
    }

    getState(step: any) {
      let state = UserFieldState.INITIAL as number;

      if (step == this.step) {
        state = UserFieldState.ACTIVE as number;
      } else if (step < this.step) {
        state = UserFieldState.COMPLETE as number;
      }
      return state;
    }
  }
</script>

<style lang="scss" scoped>
  .section-contact-form {
    font-size: 1em;

    @include media-breakpoint-down(md) {
      font-size: 0.75em;
      background-color: $midnight;
    }
  }

  .box-form-container {
    padding-bottom: 160px;
    opacity: 0;
    filter: blur(5px);
    transition:
            opacity 800ms,
            filter 1s;

    &.active {
      opacity: 1;
      filter: blur(0);
    }
  }

  form {
    display: flex;
    max-width: 90vw;

    @include media-breakpoint-up(md) {
      max-width: 620px;
    }

    &.zoom {
      justify-content: flex-start;
      padding: 88px 2em 2em !important;
      max-height: 100%;
      min-height: 460px;
      border: 1px solid $midnight;
      border-radius: 8px;
      overflow: hidden;
      box-shadow:
              inset 0 1px 5px 1px rgba(233, 233, 233, 0.1),
              0 10px 30px 0 rgba(0, 0, 0, 0.05);
      transform: translate(0, 0) scale(0.8);

      &::after {
        content: ' ';
        position: absolute;
        top: 0;
        left: 50%;
        margin: 18px;
        width: 42px;
        height: 48px;
        // background: no-repeat center / contain url('/img/customer/Logo.png');
        filter: brightness(16);
        transform: translate(-100%, 0);
        opacity: 0.18;
      }
    }
  }

  menu {
    display: flex;
    bottom: 0;
    left: 50%;
    transform: translate3d(-50%, -92px, 0);

    button {
      position: relative;
      margin: 0 9px;
      width: auto;
      min-width: 120px;

      &[disabled] {
        opacity: 0.35;
      }

      &.attract:not([disabled]) {
        animation: buttonPulse 250ms alternate infinite;
      }

      @include media-breakpoint-up(md) {
        &.button-next::after {
          content: "Or Press 'Enter'";
          position: absolute;
          top: 58px;
          left: 50%;
          display: inline-block;
          width: 100%;
          color: $white;
          font-size: 14px;
          line-height: 1.5;
          font-weight: 300;
          transform: translate3d(-50%, 0, 0);
        }
      }
    }
  }

  .box-success-message,
  .box-error-message {
    display: none;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
    padding: 96px 0 0;
    max-width: 400px;
    color: $white;

    &.display {
      display: flex;
    }

    &::after {
      content: ' ';
      position: absolute;
      top: 0;
      left: 50%;
      margin: 18px;
      width: 30px;
      height: 30px;
      transform: translate3d(-100%, 0, 0);
      // background: no-repeat center / contain url('/img/customer/checkmark2x.png');
    }

    span {
      display: block;

      &.eyebrow {
        margin: 0 0 10px;
        color: inherit;
      }

      &:last-child {
        font-family: $sans-serif;
        font-size: 32px;
        font-weight: 700;
        text-align: center;
      }
    }
  }

  .button-cancel {
    position: absolute;
    top: 1em;
    right: 1em;
    transform: translate3d(-100%, 100%, 0) scale(1);
    @include close-button;
    transition: transform 200ms;

    &:active {
      transform: translate3d(-100%, 100%, 0) scale(0.8);
    }
  }

  @keyframes buttonPulse {
    0% {
      transform: scale(1);
    }
    100% {
      transform: scale(1.05);
    }
  }
</style>
