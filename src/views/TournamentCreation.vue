<template>
  <div class="tournament-creation">
    <tournament-creation-form/>
  </div>
</template>

<script>
import { clearTokenAndStateMixin } from '@/mixins/clearTokenAndState.mixin'
import TournamentCreationForm from '@/components/TournamentCreationForm.vue'

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
