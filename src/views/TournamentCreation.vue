<template>
  <div class="tournament-creation">
    <TournamentCreationForm></TournamentCreationForm>
  </div>
</template>

<script>
// TODO: ON REFRESH ASK SERVER FOR TOURNAMENT INFO WITH THE STORED JWT
import TournamentCreationForm from '@/components/TournamentCreationForm.vue'

export default {
  name: 'TournamentCreation',
  components: {
    TournamentCreationForm
  }
}
</script>
