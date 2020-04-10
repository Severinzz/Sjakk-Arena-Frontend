<template>
  <div class="tournament-creation">
    <TournamentCreationForm></TournamentCreationForm>
  </div>
</template>

<script>
import TournamentCreationForm from '@/components/TournamentCreationForm.vue'
import { mapActions } from 'vuex'

export default {
  name: 'TournamentCreation',
  components: {
    TournamentCreationForm
  },
  methods: {
    ...mapActions([
      'deleteTokenAndSetStateToDefault'
    ])
  },
  created() {
    this.deleteTokenAndSetStateToDefault()
  }
}
</script>
