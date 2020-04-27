<template>
  <div class="tournament-creation">
    <tournament-creation-form/>
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
  ]
}
</script>
