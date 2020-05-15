<template>
    <li>
      <router-link
        :to="link"
        target="_blank"
        class="router-link"
      >
        {{ text }}
      </router-link>
    </li>
</template>

<script>
export default {
  name: 'RouterListElement',
  props: {
    link: {
      type: String,
      required: true
    },
    text: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped>
  .router-link {
    cursor: pointer;
    color: black!important;
  }
</style>
