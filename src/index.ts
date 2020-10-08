import InteractiveForm from './components/InteractiveForm.vue';
import InteractiveFormInput from './components/InteractiveFormInput.vue';
import TestComponent from './components/TestComponent.vue';

export function install(Vue: any): void {
  Vue.component('form-custom', InteractiveForm);
  Vue.component('form-custom-input', InteractiveFormInput);
  Vue.component('form-custom-test', TestComponent);
}

