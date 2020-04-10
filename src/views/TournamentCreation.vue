<template>
  <div class="tournament-creation">
    <TournamentCreationForm></TournamentCreationForm>
  </div>
</template>

<script>
import TournamentCreationForm from '@/components/TournamentCreationForm.vue'
import { mapMutations } from 'vuex'

export default {
  name: 'TournamentCreation',
  components: {
    TournamentCreationForm
  },
  methods: {
    ...mapMutations([
      'setStateToDefault'
    ])
  },
  created() {
    this.setStateToDefault()
  }
}
</script>
