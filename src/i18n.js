import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // Navigation
      "nav.dashboard": "Dashboard",
      "nav.members": "Members",
      "nav.sessions": "Active Sessions",
      "nav.users": "User Management",
      "nav.roles": "Role Management",
      "nav.profile": "My Profile",
      "nav.settings": "Settings",
      "nav.logout": "Logout",
      
      // Dashboard
      "dashboard.welcome": "Welcome back, {{name}}!",
      "dashboard.adminSubtitle": "Manage users, view statistics, and oversee all aspects of the member registry system.",
      "dashboard.userSubtitle": "View and manage member information from your personalized dashboard.",
      "dashboard.totalMembers": "Total Members",
      "dashboard.viewAllMembers": "View all members",
      "dashboard.quickActions": "Quick Actions",
      "dashboard.addMember": "Add Member",
      "dashboard.registerMember": "Register new member",
      "dashboard.recentMembers": "Recent Members",
      "dashboard.viewAll": "View all",
      "dashboard.loading": "Loading...",
      "dashboard.noMembers": "No members yet. Create your first member!",
      "dashboard.adding": "Adding...",
      
      // Members
      "members.title": "Members",
      "members.subtitle": "Manage your organization's member registry",
      "members.register": "Register Member",
      "members.name": "Name",
      "members.email": "Email",
      "members.phone": "Phone",
      "members.added": "Added",
      "members.actions": "Actions",
      "members.search": "Search by name, email, or phone...",
      "members.showing": "Showing {{start}}-{{end}} of {{total}} members",
      "members.edit": "Edit member",
      "members.delete": "Delete member",
      "members.addedBy": "Added by {{user}}",
      "members.by": "by {{user}}",
      "members.bulk.selected": "{{count}} selected",
      "members.bulk.selectAll": "Select all",
      "members.bulk.deselectAll": "Deselect all",
      "members.bulk.deleteSelected": "Delete Selected",
      "members.bulk.deleting": "Deleting...",
      "members.bulk.noSelection": "Please select members to delete",
      "members.bulk.confirmDelete": "Are you sure you want to delete {{count}} member(s)?",
      "members.bulk.jobCreated": "Bulk delete job created. Check the jobs sidebar for progress.",
      "members.bulk.deleteFailed": "Failed to create bulk delete job",
      "members.excel.upload": "Upload Excel",
      "members.excel.uploadTitle": "Upload Members from Excel",
      "members.excel.uploadDescription": "Upload an Excel file (.xlsx or .xls) to bulk import members.",
      "members.excel.formatTitle": "Expected Format:",
      "members.excel.formatRow1": "Row 1: Name | Email | Phone (headers)",
      "members.excel.formatRow2": "Row 2+: Data rows",
      "members.excel.example": "Example",
      "members.excel.selectFile": "Select Excel File",
      "members.excel.uploading": "Uploading...",
      "members.excel.noFile": "Please select a file to upload",
      "members.excel.invalidFormat": "File must be an Excel file (.xlsx or .xls)",
      "members.excel.jobCreated": "Excel upload job created. Check the jobs sidebar for progress.",
      "members.excel.uploadFailed": "Failed to upload Excel file",
      
      // Activity Feed
      "activity.title": "Recent Activity",
      "activity.loading": "Loading activities...",
      "activity.createdMember": "created member",
      "activity.updatedMember": "updated member",
      "activity.deletedMember": "deleted member",
      "activity.performedAction": "performed action",
      
      // Member Form
      "form.name": "Name",
      "form.email": "Email",
      "form.phone": "Phone Number",
      "form.submit": "Submit",
      "form.save": "Save",
      "form.cancel": "Cancel",
      "form.register": "Register",
      "form.update": "Update",
      
      // Audit Info
      "audit.addedBy": "by {{user}}",
      "audit.timeAgo": "{{time}} ago",
      
      // Messages
      "success.memberCreated": "Member registered successfully",
      "success.memberUpdated": "Member updated successfully",
      "success.memberDeleted": "Member deleted successfully",
      "error.memberFetch": "Failed to fetch members",
      "error.memberCreate": "Failed to create member",
      "error.memberUpdate": "Failed to update member",
      "error.memberDelete": "Failed to delete member",
      
      // Auth
      "auth.login": "Login",
      "auth.username": "Username",
      "auth.password": "Password",
      "auth.rememberMe": "Remember me",
      "auth.forgotPassword": "Forgot password?",
      "auth.loginSuccess": "Login successful",
      "auth.loginFailed": "Invalid username or password",
      "auth.logoutSuccess": "Logout successful",
      
      // Validation
      "validation.nameRequired": "Name is required",
      "validation.emailRequired": "Email is required",
      "validation.emailInvalid": "Invalid email format",
      "validation.phoneRequired": "Phone number is required",
      "validation.phoneInvalid": "Invalid phone number format",
      
      // Common
      "common.loading": "Loading...",
      "common.noData": "No data available",
      "common.confirm": "Confirm",
      "common.cancel": "Cancel",
      "common.delete": "Delete",
      "common.edit": "Edit",
      "common.save": "Save",
      "common.close": "Close",
      
      // Toast Messages
      "toast.addSuccess": "Member added successfully!",
      "toast.updateSuccess": "Member updated successfully!",
      "toast.deleteSuccess": "Member deleted successfully!",
      "toast.operationFailed": "Operation failed",
      
      // Jobs
      "jobs.title": "Background Jobs",
      "jobs.bulkDelete": "Bulk Delete Members",
      "jobs.excelUpload": "Excel Upload",
      "jobs.successful": "successful",
      "jobs.failed": "failed",
      "jobs.completedAgo": "Completed {{time}} ago",
      "jobs.startedAgo": "Started {{time}} ago",
      "jobs.cancel": "Cancel",
      "jobs.viewDetails": "View Details",
      "jobs.dismiss": "Dismiss",
      "jobs.statusFailed": "Failed",
      "jobs.status.pending": "Pending",
      "jobs.status.in_progress": "In Progress",
      "jobs.status.completed": "Completed",
      "jobs.status.failed": "Failed",
      "jobs.status.cancelled": "Cancelled",
      "jobs.totalItems": "Total Items",
      "jobs.startedBy": "Started By",
      "jobs.createdAt": "Created At",
      "jobs.startedAt": "Started At",
      "jobs.completedAt": "Completed At",
      "jobs.duration": "Duration",
      "jobs.successfulResults": "Successfully Processed",
      "jobs.failedResults": "Failed Items",
      "jobs.errorMessage": "Error Message",
      
      // Language
      "language.select": "Language",
      "language.english": "English",
      "language.hindi": "हिन्दी (Hindi)",
      "language.spanish": "Español (Spanish)"
    }
  },
  hi: {
    translation: {
      // Navigation
      "nav.dashboard": "डैशबोर्ड",
      "nav.members": "सदस्य",
      "nav.sessions": "सक्रिय सत्र",
      "nav.users": "उपयोगकर्ता प्रबंधन",
      "nav.roles": "भूमिका प्रबंधन",
      "nav.profile": "मेरी प्रोफ़ाइल",
      "nav.settings": "सेटिंग्स",
      "nav.logout": "लॉगआउट",
      
      // Dashboard
      "dashboard.welcome": "आपका स्वागत है, {{name}}!",
      "dashboard.adminSubtitle": "उपयोगकर्ताओं को प्रबंधित करें, आंकड़े देखें, और सदस्य रजिस्ट्री सिस्टम के सभी पहलुओं की देखरेख करें।",
      "dashboard.userSubtitle": "अपने व्यक्तिगत डैशबोर्ड से सदस्य जानकारी देखें और प्रबंधित करें।",
      "dashboard.totalMembers": "कुल सदस्य",
      "dashboard.viewAllMembers": "सभी सदस्य देखें",
      "dashboard.quickActions": "त्वरित कार्रवाई",
      "dashboard.addMember": "सदस्य जोड़ें",
      "dashboard.registerMember": "नया सदस्य पंजीकृत करें",
      "dashboard.recentMembers": "हाल के सदस्य",
      "dashboard.viewAll": "सभी देखें",
      "dashboard.loading": "लोड हो रहा है...",
      "dashboard.noMembers": "अभी तक कोई सदस्य नहीं है। अपना पहला सदस्य बनाएं!",
      "dashboard.adding": "जोड़ा जा रहा है...",
      
      // Members
      "members.title": "सदस्य",
      "members.subtitle": "अपने संगठन की सदस्य रजिस्ट्री प्रबंधित करें",
      "members.register": "सदस्य पंजीकृत करें",
      "members.name": "नाम",
      "members.email": "ईमेल",
      "members.phone": "फ़ोन",
      "members.added": "जोड़ा गया",
      "members.actions": "कार्रवाई",
      "members.search": "नाम, ईमेल या फ़ोन से खोजें...",
      "members.showing": "{{total}} में से {{start}}-{{end}} सदस्य दिखा रहे हैं",
      "members.edit": "सदस्य संपादित करें",
      "members.delete": "सदस्य हटाएं",
      "members.addedBy": "{{user}} द्वारा जोड़ा गया",
      "members.by": "{{user}} द्वारा",
      "members.bulk.selected": "{{count}} चयनित",
      "members.bulk.selectAll": "सभी चुनें",
      "members.bulk.deselectAll": "सभी अचयनित करें",
      "members.bulk.deleteSelected": "चयनित हटाएं",
      "members.bulk.deleting": "हटाया जा रहा है...",
      "members.bulk.noSelection": "कृपया हटाने के लिए सदस्यों का चयन करें",
      "members.bulk.confirmDelete": "क्या आप वाकई {{count}} सदस्य हटाना चाहते हैं?",
      "members.bulk.jobCreated": "बल्क डिलीट जॉब बनाई गई। प्रगति के लिए जॉब साइडबार देखें।",
      "members.bulk.deleteFailed": "बल्क डिलीट जॉब बनाने में विफल",
      "members.excel.upload": "Excel अपलोड करें",
      "members.excel.uploadTitle": "Excel से सदस्य अपलोड करें",
      "members.excel.uploadDescription": "सदस्यों को थोक में आयात करने के लिए एक Excel फ़ाइल (.xlsx या .xls) अपलोड करें।",
      "members.excel.formatTitle": "अपेक्षित प्रारूप:",
      "members.excel.formatRow1": "पंक्ति 1: नाम | ईमेल | फ़ोन (शीर्षक)",
      "members.excel.formatRow2": "पंक्ति 2+: डेटा पंक्तियाँ",
      "members.excel.example": "उदाहरण",
      "members.excel.selectFile": "Excel फ़ाइल चुनें",
      "members.excel.uploading": "अपलोड हो रहा है...",
      "members.excel.noFile": "कृपया अपलोड करने के लिए एक फ़ाइल चुनें",
      "members.excel.invalidFormat": "फ़ाइल Excel फ़ाइल होनी चाहिए (.xlsx या .xls)",
      "members.excel.jobCreated": "Excel अपलोड जॉब बनाई गई। प्रगति के लिए जॉब साइडबार देखें।",
      "members.excel.uploadFailed": "Excel फ़ाइल अपलोड करने में विफल",
      
      // Activity Feed
      "activity.title": "हालिया गतिविधि",
      "activity.loading": "गतिविधियां लोड हो रही हैं...",
      "activity.createdMember": "सदस्य बनाया",
      "activity.updatedMember": "सदस्य अपडेट किया",
      "activity.deletedMember": "सदस्य हटाया",
      "activity.performedAction": "कार्रवाई की",
      
      // Member Form
      "form.name": "नाम",
      "form.email": "ईमेल",
      "form.phone": "फ़ोन नंबर",
      "form.submit": "जमा करें",
      "form.save": "सहेजें",
      "form.cancel": "रद्द करें",
      "form.register": "पंजीकरण करें",
      "form.update": "अपडेट करें",
      
      // Audit Info
      "audit.addedBy": "{{user}} द्वारा",
      "audit.timeAgo": "{{time}} पहले",
      
      // Messages
      "success.memberCreated": "सदस्य सफलतापूर्वक पंजीकृत हुआ",
      "success.memberUpdated": "सदस्य सफलतापूर्वक अपडेट किया गया",
      "success.memberDeleted": "सदस्य सफलतापूर्वक हटाया गया",
      "error.memberFetch": "सदस्यों को प्राप्त करने में विफल",
      "error.memberCreate": "सदस्य बनाने में विफल",
      "error.memberUpdate": "सदस्य अपडेट करने में विफल",
      "error.memberDelete": "सदस्य हटाने में विफल",
      
      // Auth
      "auth.login": "लॉगिन",
      "auth.username": "उपयोगकर्ता नाम",
      "auth.password": "पासवर्ड",
      "auth.rememberMe": "मुझे याद रखें",
      "auth.forgotPassword": "पासवर्ड भूल गए?",
      "auth.loginSuccess": "लॉगिन सफल",
      "auth.loginFailed": "अमान्य उपयोगकर्ता नाम या पासवर्ड",
      "auth.logoutSuccess": "लॉगआउट सफल",
      
      // Validation
      "validation.nameRequired": "नाम आवश्यक है",
      "validation.emailRequired": "ईमेल आवश्यक है",
      "validation.emailInvalid": "अमान्य ईमेल प्रारूप",
      "validation.phoneRequired": "फ़ोन नंबर आवश्यक है",
      "validation.phoneInvalid": "अमान्य फ़ोन नंबर प्रारूप",
      
      // Common
      "common.loading": "लोड हो रहा है...",
      "common.noData": "कोई डेटा उपलब्ध नहीं",
      "common.confirm": "पुष्टि करें",
      "common.cancel": "रद्द करें",
      "common.delete": "हटाएं",
      "common.edit": "संपादित करें",
      "common.save": "सहेजें",
      "common.close": "बंद करें",
      
      // Toast Messages
      "toast.addSuccess": "सदस्य सफलतापूर्वक जोड़ा गया!",
      "toast.updateSuccess": "सदस्य सफलतापूर्वक अपडेट किया गया!",
      "toast.deleteSuccess": "सदस्य सफलतापूर्वक हटाया गया!",
      "toast.operationFailed": "ऑपरेशन विफल रहा",
      
      // Jobs
      "jobs.title": "बैकग्राउंड जॉब्स",
      "jobs.bulkDelete": "बल्क डिलीट सदस्य",
      "jobs.excelUpload": "Excel अपलोड",
      "jobs.successful": "सफल",
      "jobs.failed": "विफल",
      "jobs.completedAgo": "{{time}} पहले पूर्ण हुआ",
      "jobs.startedAgo": "{{time}} पहले शुरू हुआ",
      "jobs.cancel": "रद्द करें",
      "jobs.viewDetails": "विवरण देखें",
      "jobs.dismiss": "हटाएं",
      "jobs.statusFailed": "विफल",
      "jobs.status.pending": "लंबित",
      "jobs.status.in_progress": "प्रगति में",
      "jobs.status.completed": "पूर्ण",
      "jobs.status.failed": "विफल",
      "jobs.status.cancelled": "रद्द",
      "jobs.totalItems": "कुल आइटम",
      "jobs.startedBy": "द्वारा शुरू किया गया",
      "jobs.createdAt": "बनाया गया",
      "jobs.startedAt": "शुरू किया गया",
      "jobs.completedAt": "पूर्ण किया गया",
      "jobs.duration": "अवधि",
      "jobs.successfulResults": "सफलतापूर्वक संसाधित",
      "jobs.failedResults": "विफल आइटम",
      "jobs.errorMessage": "त्रुटि संदेश",
      
      // Language
      "language.select": "भाषा",
      "language.english": "English (अंग्रेज़ी)",
      "language.hindi": "हिन्दी",
      "language.spanish": "Español (स्पेनिश)"
    }
  },
  es: {
    translation: {
      // Navigation
      "nav.dashboard": "Panel",
      "nav.members": "Miembros",
      "nav.sessions": "Sesiones Activas",
      "nav.users": "Gestión de Usuarios",
      "nav.roles": "Gestión de Roles",
      "nav.profile": "Mi Perfil",
      "nav.settings": "Configuración",
      "nav.logout": "Cerrar Sesión",
      
      // Dashboard
      "dashboard.welcome": "¡Bienvenido de nuevo, {{name}}!",
      "dashboard.adminSubtitle": "Administre usuarios, vea estadísticas y supervise todos los aspectos del sistema de registro de miembros.",
      "dashboard.userSubtitle": "Vea y administre la información de los miembros desde su panel personalizado.",
      "dashboard.totalMembers": "Total de Miembros",
      "dashboard.viewAllMembers": "Ver todos los miembros",
      "dashboard.quickActions": "Acciones Rápidas",
      "dashboard.addMember": "Agregar Miembro",
      "dashboard.registerMember": "Registrar nuevo miembro",
      "dashboard.recentMembers": "Miembros Recientes",
      "dashboard.viewAll": "Ver todo",
      "dashboard.loading": "Cargando...",
      "dashboard.noMembers": "Aún no hay miembros. ¡Cree su primer miembro!",
      "dashboard.adding": "Agregando...",
      
      // Members
      "members.title": "Miembros",
      "members.subtitle": "Administre el registro de miembros de su organización",
      "members.register": "Registrar Miembro",
      "members.name": "Nombre",
      "members.email": "Correo",
      "members.phone": "Teléfono",
      "members.added": "Agregado",
      "members.actions": "Acciones",
      "members.search": "Buscar por nombre, correo o teléfono...",
      "members.showing": "Mostrando {{start}}-{{end}} de {{total}} miembros",
      "members.edit": "Editar miembro",
      "members.delete": "Eliminar miembro",
      "members.addedBy": "Agregado por {{user}}",
      "members.by": "por {{user}}",
      "members.bulk.selected": "{{count}} seleccionado(s)",
      "members.bulk.selectAll": "Seleccionar todo",
      "members.bulk.deselectAll": "Deseleccionar todo",
      "members.bulk.deleteSelected": "Eliminar Seleccionados",
      "members.bulk.deleting": "Eliminando...",
      "members.bulk.noSelection": "Por favor seleccione miembros para eliminar",
      "members.bulk.confirmDelete": "¿Está seguro de que desea eliminar {{count}} miembro(s)?",
      "members.bulk.jobCreated": "Trabajo de eliminación masiva creado. Verifique la barra lateral de trabajos para el progreso.",
      "members.bulk.deleteFailed": "Error al crear el trabajo de eliminación masiva",
      "members.excel.upload": "Subir Excel",
      "members.excel.uploadTitle": "Subir Miembros desde Excel",
      "members.excel.uploadDescription": "Suba un archivo de Excel (.xlsx o .xls) para importar miembros masivamente.",
      "members.excel.formatTitle": "Formato Esperado:",
      "members.excel.formatRow1": "Fila 1: Nombre | Correo | Teléfono (encabezados)",
      "members.excel.formatRow2": "Fila 2+: Filas de datos",
      "members.excel.example": "Ejemplo",
      "members.excel.selectFile": "Seleccionar Archivo Excel",
      "members.excel.uploading": "Subiendo...",
      "members.excel.noFile": "Por favor seleccione un archivo para subir",
      "members.excel.invalidFormat": "El archivo debe ser un archivo de Excel (.xlsx o .xls)",
      "members.excel.jobCreated": "Trabajo de carga de Excel creado. Verifique la barra lateral de trabajos para el progreso.",
      "members.excel.uploadFailed": "Error al subir el archivo de Excel",
      
      // Activity Feed
      "activity.title": "Actividad Reciente",
      "activity.loading": "Cargando actividades...",
      "activity.createdMember": "creó miembro",
      "activity.updatedMember": "actualizó miembro",
      "activity.deletedMember": "eliminó miembro",
      "activity.performedAction": "realizó acción",
      
      // Member Form
      "form.name": "Nombre",
      "form.email": "Correo Electrónico",
      "form.phone": "Número de Teléfono",
      "form.submit": "Enviar",
      "form.save": "Guardar",
      "form.cancel": "Cancelar",
      "form.register": "Registrar",
      "form.update": "Actualizar",
      
      // Audit Info
      "audit.addedBy": "por {{user}}",
      "audit.timeAgo": "hace {{time}}",
      
      // Messages
      "success.memberCreated": "Miembro registrado exitosamente",
      "success.memberUpdated": "Miembro actualizado exitosamente",
      "success.memberDeleted": "Miembro eliminado exitosamente",
      "error.memberFetch": "Error al obtener miembros",
      "error.memberCreate": "Error al crear miembro",
      "error.memberUpdate": "Error al actualizar miembro",
      "error.memberDelete": "Error al eliminar miembro",
      
      // Auth
      "auth.login": "Iniciar Sesión",
      "auth.username": "Usuario",
      "auth.password": "Contraseña",
      "auth.rememberMe": "Recuérdame",
      "auth.forgotPassword": "¿Olvidaste tu contraseña?",
      "auth.loginSuccess": "Inicio de sesión exitoso",
      "auth.loginFailed": "Usuario o contraseña inválidos",
      "auth.logoutSuccess": "Cierre de sesión exitoso",
      
      // Validation
      "validation.nameRequired": "El nombre es obligatorio",
      "validation.emailRequired": "El correo es obligatorio",
      "validation.emailInvalid": "Formato de correo no válido",
      "validation.phoneRequired": "El teléfono es obligatorio",
      "validation.phoneInvalid": "Formato de teléfono no válido",
      
      // Common
      "common.loading": "Cargando...",
      "common.noData": "No hay datos disponibles",
      "common.confirm": "Confirmar",
      "common.cancel": "Cancelar",
      "common.delete": "Eliminar",
      "common.edit": "Editar",
      "common.save": "Guardar",
      "common.close": "Cerrar",
      
      // Toast Messages
      "toast.addSuccess": "¡Miembro agregado exitosamente!",
      "toast.updateSuccess": "¡Miembro actualizado exitosamente!",
      "toast.deleteSuccess": "¡Miembro eliminado exitosamente!",
      "toast.operationFailed": "Operación fallida",
      
      // Jobs
      "jobs.title": "Trabajos en Segundo Plano",
      "jobs.bulkDelete": "Eliminación Masiva de Miembros",
      "jobs.excelUpload": "Carga de Excel",
      "jobs.successful": "exitoso",
      "jobs.failed": "fallido",
      "jobs.completedAgo": "Completado hace {{time}}",
      "jobs.startedAgo": "Iniciado hace {{time}}",
      "jobs.cancel": "Cancelar",
      "jobs.viewDetails": "Ver Detalles",
      "jobs.dismiss": "Descartar",
      "jobs.statusFailed": "Fallido",
      "jobs.status.pending": "Pendiente",
      "jobs.status.in_progress": "En Progreso",
      "jobs.status.completed": "Completado",
      "jobs.status.failed": "Fallido",
      "jobs.status.cancelled": "Cancelado",
      "jobs.totalItems": "Total de Elementos",
      "jobs.startedBy": "Iniciado Por",
      "jobs.createdAt": "Creado En",
      "jobs.startedAt": "Iniciado En",
      "jobs.completedAt": "Completado En",
      "jobs.duration": "Duración",
      "jobs.successfulResults": "Procesados Exitosamente",
      "jobs.failedResults": "Elementos Fallidos",
      "jobs.errorMessage": "Mensaje de Error",
      
      // Language
      "language.select": "Idioma",
      "language.english": "English (Inglés)",
      "language.hindi": "हिन्दी (Hindi)",
      "language.spanish": "Español"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('language') || 'en',  // Load from localStorage or default to English
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

// Save language preference to localStorage when changed
i18n.on('languageChanged', (lng) => {
  localStorage.setItem('language', lng);
});

export default i18n;

