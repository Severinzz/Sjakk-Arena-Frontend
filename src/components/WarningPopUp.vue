<template>
  <div id="warning">
    <v-card class="elevation-5 ma-auto"
            max-width="400">
      <v-card-text class="text-center">
        <span id="warning-text">{{ message }}</span>
      </v-card-text>
      <v-row>
        <v-col cols="12">
          <v-row justify="center">
              <v-btn class="mr-5 px-10 mt-3" color="primary"
                     :to="primaryBtnOnClickPath">
                {{ primaryBtnName }}
              </v-btn>
            <v-btn class="mr-5 px-10 mt-3"
                   :hidden="secondaryBtnNameHide"
                   :to="secondaryBtnOnClickPath">
              {{ secondaryBtnName }}
            </v-btn>
          </v-row>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'WarningPopUp',
  props: {
    message: String,
    primaryBtnName: {
      type: Boolean,
      default: function () {
        return 'Nei'
      }
    },
    secondaryBtnName: {
      type: Boolean,
      default: function () {
        return 'Ja'
      }
    },
    secondaryBtnNameHide: {
      type: Boolean,
      default: function () {
        return false
      }
    },
    primaryBtnOnClickPath: String,
    secondaryBtnOnClickPath: String
  }
}
</script>

<style scoped>
  #warning-text{
    font-size: 125%;
  }
  #warning{
    margin: 20vh auto;
  }
</style>
