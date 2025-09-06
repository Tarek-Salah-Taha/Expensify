import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      // Navigation
      dashboard: "Dashboard",
      expenses: "Expenses",
      charts: "Charts",
      profile: "Profile",
      logout: "Logout",

      // Auth
      login: "Login",
      register: "Register",
      email: "Email",
      password: "Password",
      confirmPassword: "Confirm Password",
      forgotPassword: "Forgot Password?",
      dontHaveAccount: "Don't have an account?",
      alreadyHaveAccount: "Already have an account?",
      continueAsGuest: "Continue as Guest",
      continueAsGuestLocally: "Or continue as guest (data saved locally)",
      enterEmail: "Enter your email",
      enterPassword: "Enter your Password",

      // Expense Form
      addExpense: "Add Expense",
      editExpense: "Edit Expense",
      title: "Title",
      amount: "Amount",
      category: "Category",
      date: "Date",
      description: "Description",
      save: "Save",
      cancel: "Cancel",
      delete: "Delete",
      actions: "Actions",
      edit: "Edit",
      enterDescription: "Enter Description",
      optional: "Optional",

      // Categories
      food: "Food",
      transport: "Transport",
      entertainment: "Entertainment",
      health: "Health",
      shopping: "Shopping",
      bills: "Bills",
      other: "Other",

      // Dashboard
      totalExpenses: "Total Expenses",
      thisMonth: "This Month",
      recentExpenses: "Recent Expenses",
      noExpenses: "No expenses found",
      averagePerExpense: "Average per Expense",
      categoriesUsed: "Categories Used",
      differentCategories: "Different categories",
      perExpenseAverage: "Per expense average",
      expensesThisMonth: "Expenses this month",
      expensesTotal: "Expenses total",
      expensesByCategory: "Expenses By Category",
      monthlySpending: "Monthly Spending",

      // Common
      loading: "Loading...",
      error: "Error",
      success: "Success",
      currency: "$",
      deleting: "Deleting...",

      // Messages
      expenseAdded: "Expense added successfully",
      expenseUpdated: "Expense updated successfully",
      expenseDeleted: "Expense deleted successfully",
      loginSuccess: "Login successful",
      registerSuccess: "Registration successful",
      logoutSuccess: "Logout successful",
      deleteExpense: "Delete Expense",
      deleteExpenseConfirmation:
        "Are you sure you want to delete this expense?",

      // 404 Page
      pageNotFound: "404 - Page Not Found",
      oopsMessage: "Oops! The page you’re looking for doesn’t exist.",
      returnHome: "Return to Home",
    },
  },
  ar: {
    translation: {
      // Navigation
      dashboard: "لوحة التحكم",
      expenses: "المصروفات",
      charts: "الرسوم البيانية",
      profile: "الملف الشخصي",
      logout: "تسجيل الخروج",

      // Auth
      login: "تسجيل الدخول",
      register: "إنشاء حساب",
      email: "البريد الإلكتروني",
      password: "كلمة المرور",
      confirmPassword: "تأكيد كلمة المرور",
      forgotPassword: "نسيت كلمة المرور؟",
      dontHaveAccount: "ليس لديك حساب؟",
      alreadyHaveAccount: "لديك حساب بالفعل؟",
      continueAsGuest: "الاستمرار كضيف",
      continueAsGuestLocally: "أو الاستمرار كضيف (يتم حفظ البيانات محليًا)",

      // Expense Form
      addExpense: "إضافة مصروف",
      editExpense: "تعديل المصروف",
      title: "العنوان",
      amount: "المبلغ",
      category: "الفئة",
      date: "التاريخ",
      description: "الوصف",
      save: "حفظ",
      cancel: "إلغاء",
      delete: "حذف",
      actions: "الإجراءات",
      edit: "تعديل",
      enterEmail: "أدخل بريدك الإلكتروني",
      enterPassword: "أدخل كلمة المرور الخاصة بك",
      enterDescription: "أدخل الوصف",
      optional: "اختياري",

      // Categories
      food: "طعام",
      transport: "مواصلات",
      entertainment: "ترفيه",
      health: "صحة",
      shopping: "تسوق",
      bills: "فواتير",
      other: "أخرى",

      // Dashboard
      totalExpenses: "إجمالي المصروفات",
      thisMonth: "هذا الشهر",
      recentExpenses: "المصروفات الأخيرة",
      noExpenses: "لا توجد مصروفات",
      averagePerExpense: "متوسط المصروفات",
      categoriesUsed: "الفئات المستخدمة",
      differentCategories: "فئات مختلفة",
      perExpenseAverage: "متوسط المصروفات",
      expensesThisMonth: "المصروفات هذا الشهر",
      expensesTotal: "إجمالي المصروفات",
      expensesByCategory: "الإنفاق حسب الفئة",
      monthlySpending: "الإنفاق الشهري",

      // Common
      loading: "جاري التحميل...",
      error: "خطأ",
      success: "نجح",
      currency: "دولار",
      deleting: "جاري الحذف...",

      // Messages
      expenseAdded: "تم إضافة المصروف بنجاح",
      expenseUpdated: "تم تحديث المصروف بنجاح",
      expenseDeleted: "تم حذف المصروف بنجاح",
      loginSuccess: "تم تسجيل الدخول بنجاح",
      registerSuccess: "تم إنشاء الحساب بنجاح",
      logoutSuccess: "تم تسجيل الخروج بنجاح",
      deleteExpense: "حذف المصروف",
      deleteExpenseConfirmation: "؟هل أنت متأكد أنك تريد حذف هذه المصروفات",

      // 404 Page
      pageNotFound: "404 - لم يتم العثور على الصفحة",
      oopsMessage: "عفواً! الصفحة التي تبحث عنها غير موجودة.",
      returnHome: "العودة إلى الصفحة الرئيسية",
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
