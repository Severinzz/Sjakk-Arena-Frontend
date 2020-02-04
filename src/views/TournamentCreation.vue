<template>
  <div class="tournament-creation">
    <AppHeader></AppHeader>
    <TournamentCreationForm></TournamentCreationForm>
    <AppFooter></AppFooter>
  </div>
</template>

<script>
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
import TournamentCreationForm from '@/components/TournamentCreationForm.vue'
export default {
  name: 'TournamentCreation',
  components: {
    AppHeader,
    AppFooter,
    TournamentCreationForm
  }
}
</script>
