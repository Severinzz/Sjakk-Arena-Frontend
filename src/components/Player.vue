<template>
  <div>
    {{playerName}}
    <i class={{playerPiece}}></i>
  </div>
</template>

<script>
export default {
  name: 'Player',
  props: {
    playerName: { type: String, required: true },
    playerPiece: { type: String, required: false }
  }
}
</script>

<style scoped>

</style>
