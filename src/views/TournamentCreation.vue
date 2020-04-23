<template>
  <div class="tournament-creation">
    <tournament-creation-form @error="handleError"/>
  </div>
</template>

<script>
import TournamentCreationForm from '@/components/TournamentCreationForm.vue'
import { clearTokenAndStateMixin } from '../mixins/clearTokenAndState.mixin'

export default {
  name: 'TournamentCreation',
  components: {
    TournamentCreationForm
  },
  mixins: [
    clearTokenAndStateMixin
  ],
  methods: {
    handleError(err) {
      this.$emit('error', err)
    }
  }
}
</script>
