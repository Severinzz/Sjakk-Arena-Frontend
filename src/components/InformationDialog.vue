<template>
  <v-row
    class="justify-center"
    align="center"
  >
    <v-dialog
      v-model="showDialog"
      persistent
      max-width="650px"
    >
      <v-card>
        <v-card-title class="justify-center">{{ title }}</v-card-title>
        <v-card-text class="text-center"> {{ text }}
        </v-card-text>
        <v-layout justify-center>
          <v-card-actions>
            <v-btn
              textv
              @click="closeDialog"
            >
              Lukk
            </v-btn>
          </v-card-actions>
        </v-layout>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
  name: 'InformationDialog',
  props: {
    showDialog: {
      type: Boolean,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    text: {
      type: String,
      required: true
    }
  },
  methods: {
    closeDialog: function () {
      this.$emit('closeDialog')
    }
  }
}
</script>

<style scoped>

</style>
