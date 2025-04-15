<template>
  <div class="b">
    <div class="border">
      <div class="c">
        <div class="v text-end pa-10">
          <!-- خوش‌آمدگویی و دکمه ورود -->
          <div v-if="show">
            <span class="text-h4">! ...با سلام {{ userInfo?.xseller }}</span>
            <p class="text-h5 mt-5">
              شما به کمیسیون شرکت بهاران دعوت شدید، برای شرکت در کمیسیون وارد
              شوید
            </p>
            <div class="text-center mt-5">
              <v-btn
                color="success"
                width="200"
                class="mt-5 pa-2"
                @click="enterForm"
                ,!showmenu
                >ورود</v-btn
              >
            </div>
          </div>
          <div v-if="showmenu">
            <v-row>
              <v-col
                v-for="(item, index) in items"
                :key="index"
                cols="12"
                sm="4"
              >
                <v-card
                  class="pt-5 bg-grey-lighten-3 rounded-xl border-opacity-25 border-b-lg"
                  @click="openDialog(item)"
                  height="220px"
                  style="cursor: pointer"
                >
                  <div class="text-subtitle-1 font-weight-bold">
                    <p class="text-h5 ma-2">: نام محصول</p>
                    <div class="text-start">
                      <v-chip class="text-h5 pa-5 ms-5">{{ item.name }}</v-chip>
                    </div>
                    <p class="text-h5 ma-1">: مقدار</p>
                    <div class="text-start">
                      <v-chip class="font-weight-bold text-h7 pa-5 ms-5"
                        >{{ item.amount }} {{ item.vahed }}</v-chip
                      >
                    </div>
                  </div>
                </v-card>
              </v-col>
              <v-dialog v-model="dialog" max-width="500">
                <v-card class="rounded-xl">
                  <v-card-title class="font-weight-bold">
                    {{ selectedItem.amount }} {{ selectedItem.name }} -
                    قیمت‌گذاری
                  </v-card-title>

                  <v-card-text>
                    <v-text-field
                      label="قیمت هر واحد"
                      prepend-icon="mdi-currency-rial"
                      v-model.number="dialogData.unitPrice"
                      type="number"
                    />
                    <v-text-field
                      label="نوع تحویل"
                      prepend-icon="mdi-truck-delivery"
                      v-model="dialogData.delivery"
                    />
                    <v-text-field
                      label="برند (اختیاری)"
                      prepend-icon="mdi-file-cabinet"
                      v-model="dialogData.brand"
                    />
                    <v-textarea
                      label="توضیحات (اختیاری)"
                      prepend-icon="mdi-text-box-multiple-outline"
                      v-model="dialogData.description"
                    />
                  </v-card-text>

                  <v-card-actions
                    class="d-flex justify-space-between align-center"
                  >
                    <v-btn @click="closeDialog" color="red">انصراف</v-btn>
                    <div v-if="totalPrice">
                      قیمت کل: {{ totalPrice.toLocaleString() }}
                    </div>
                    <v-btn @click="submitItem" color="green">تأیید</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-row>
            <v-container>
              <v-list
                class="mt-1 bg-grey-lighten-3 rounded-xl"
                max-height="150"
              >
                <v-list-item
                  v-for="(entry, index) in submittedItems"
                  :key="index"
                  class=""
                >
                  <div
                    class="d-flex justify-lg-space-around align-center border-b pa-2"
                  >
                    <div>
                      <v-btn icon size="30" @click="removeItem(index)"
                        ><v-icon>mdi-close</v-icon></v-btn
                      >
                    </div>
                    <div class="ms-5">
                      {{ entry.amount }} تن {{ entry.name }} -
                      {{ entry.unitPrice.toLocaleString() }} ریال
                    </div>
                    <div>
                      <v-chip class="text-h6 font-weight-bold">{{
                        entry.brand
                      }}</v-chip>
                    </div>
                  </div>
                </v-list-item>
              </v-list>
            </v-container>
            <v-checkbox v-model="checkbox">
              <template v-slot:label>
                <div>
                  در صورت ارسال اطلاعات، تغییر و ویرایش امکان‌پذیر نمی‌باشد.
                </div>
              </template>
            </v-checkbox>

            <div class="text-center">
              <v-btn width="200" color="success" @click="submitForm"
                >ثبت نهایی</v-btn
              >
            </div>

            <div class="text-red mt-3" v-if="message">{{ message }}</div>
          </div>
          <!-- پیام بعد از ثبت موفق -->
          <div v-if="alreadySubmitted">
            <p class="text-h5 mt-5 text-center">
              اطلاعات شما با موفقیت ثبت شد.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
  <template>
  <div class="text-center ma-2">
    <v-btn
      @click="snackbar = true"
    >
      Open Snackbar
    </v-btn>
    <v-snackbar
      v-model="snackbar"
    >
      {{ text }}

      <template v-slot:actions>
        <v-btn
          color="pink"
          variant="text"
          @click="snackbar = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

const show = ref(true);
const notshow = ref(false);
const showmenu = ref(false);
const alreadySubmitted = ref(false);
const checkbox = ref(false);
const message = ref("");

const dialog = ref(false);
const selectedItem = ref({});

const dialogData = ref({
  unitPrice: null,
  delivery: "",
  brand: "",
  description: "",
  name: "",
  amount: 0,
});
const submittedItems = ref([]);

const openDialog = (item) => {
  selectedItem.value = item;
  dialogData.value = {
    unitPrice: null,
    delivery: "",
    brand: "",
    description: "",
    name: item.name,
    amount: item.amount,
  };
  dialog.value = true;
};

const closeDialog = () => {
  dialog.value = false;
};

const submitItem = () => {
  submittedItems.value.push({ ...dialogData.value });
  closeDialog();
};

const removeItem = (index) => {
  submittedItems.value.splice(index, 1);
};

const totalPrice = computed(() => {
  const unit = parseFloat(dialogData.value.unitPrice);
  const amount = parseFloat(dialogData.value.amount);
  return !isNaN(unit) && !isNaN(amount) ? unit * amount : null;
});

const items = ref([
  { name: "گندم", amount: 5, vahed: "تن" },
  { name: "برنج", amount: 2 },
  { name: "جو", amount: 3 },
]);

const price = ref("");
const brand = ref("");
const delivery = ref("");
const description = ref("");

const route = useRoute();
const token = route.query.token;
const userInfo = ref(null);

// onMounted(async () => {
//   if (!token) {
//     message.value = "لینک معتبر نیست.";
//     return;
//   }

//   try {
//     const res = await $fetch("/api/get-user-info?token=${token}");
//     if (res && res.xlink) {
//       userInfo.value = res;
//     } else {
//       message.value = res.error || "کاربر یافت نشد.";
//       alreadySubmitted.value = true;
//     }
//   } catch (err) {
//     console.error(err);
//     message.value = "خطا در دریافت اطلاعات";
//   }
// });

const enterForm = () => {
  show.value = false;
  notshow.value = false;
  showmenu.value = true;
};

const submitForm = async () => {
  if (!checkbox.value) {
    console.log("چک‌باکس تیک نخورده!");
    message.value = "لطفاً قبل از ثبت، چک‌باکس را تیک بزنید.";
    
    return;
  }

  try {
    console.log("در حال ارسال اطلاعات:", {
      token,
      price: price.value,
      brand: brand.value,
      delivery: delivery.value,
      description: description.value,
    });

    // const res = await $fetch("/api/submit-response", {
    //   method: "POST",
    //   body: {
    //     token,
    //     price: price.value,
    //     brand: brand.value,
    //     delivery: delivery.value,
    //     description: description.value,
    //   },
    // });

    console.log("پاسخ ثبت:", res);

    if (res.message) {
      message.value = res.message;
      alreadySubmitted.value = true;
    } else {
      message.value = res.error || "مشکلی در ثبت اطلاعات رخ داده";
    }
  } catch (error) {
    // console.error("خطا در ارسال:", error);
    // message.value = "خطا در ارسال اطلاعات";
  }
  alreadySubmitted.value=true
    show.value = false;
    notshow.value = false;
    showmenu.value = false;
    notshow.value = false;
};
</script>

<style scoped>
.b {
  height: 100vh;
  background-image: url(/public/img/1.jpg);
  background-size: cover;
}

.c {
  margin-top: 300px;
}
.v {
  background-image: url(/public/img/2.jfif);
  background-size: cover;
  width: 900px;
  margin-left: 400px;
  border: solid black 3px;
  border-radius: 15px;
}
</style>
