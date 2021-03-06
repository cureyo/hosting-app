import { environment } from '../../app/environment';
export const AppConfig = {

  baseUrl: environment.envName == 'prod' ? 'http://healthamin.com/' : 'http://localhost:3000',
  stagingUrl: 'http://healthamin.com/',
  web: {
    appID: "1133564906671009"
  },
  messenger: {
    prod: {
      appID: "207389912960881",
      pageID: "1173783939313940",
    },
    dev: {
      appID: "190268531392461",
      pageID: "164483500652387",
    }
  },

  zoho: {
    ZOHO_CRM_AUTH_KEY: '02c37a08fc4700e9d848f4e2e0bc3436'
  },
  google: {
    SEARCH_API_KEY: 'AIzaSyAD6g1Bs2ZRmRFqHP0QIrMViadzHr6BrhM'
  },
  database: {
    doctors:            'DoctorsTable/',
    users:              environment.envName + '/UserTable/',
    scheduledJobs:      environment.envName + '/Scheduled_Jobs/',
    caredOnes:          environment.envName + '/CaredOnes/',
    phone2FBID:         environment.envName + '/Phone2FBId/',
    httpRequests:       environment.envName + '/HttpRequests/',
    PaymentPlans:       environment.envName + '/PaymentPlans/',
    medicineReminders:  environment.envName + '/Medicine_Reminders/',
    pricing:            environment.envName + '/Pricing/',
    currentOrders:      environment.envName + '/CurrentOrders/',
    exerciseTracker:    environment.envName + '/Exercise_Tracker/',
    observers:          environment.envName + '/Observers/',
    caretakers:         environment.envName + '/CareTakers/',
    onboardingReview:   environment.envName + '/OnboardingReview/',
    virtualCaredOne:    environment.envName + '/VirtualCaredOne/',
    virtualObserver:    environment.envName + '/VirtualObserver/',
    virtualCareTaker:   environment.envName + '/VirtualCareTaker/',
    cared1Onboarded:    environment.envName + '/Cared1Onboarded/',
    userIds:            environment.envName + '/UserIds/',
    insights:           environment.envName + '/Insights/',
    deviceReadings:     environment.envName + '/Device_Readings/',
    consultations:      environment.envName + '/Consultations/',
    labTests:           environment.envName + '/LabTests/',
    healthReports:      environment.envName + '/HealthReports/',
    patientUpdates:     environment.envName + '/PatientUpdates/',
    activePathways:     environment.envName + '/ActiveTransactions/',
    sendMessages:       environment.envName + '/SendMessages/',
    appointments:       environment.envName + '/Appointments/',
    testPricing:        environment.envName + '/PathologicalTests/TestPricing/',
    labDetails:         environment.envName + '/PathologicalTests/LabDetails/',
    orderDetails:       environment.envName +  '/Orders/',
    docUsers:           environment.envName + '/DoctorUsers/',
    doctorPages:        environment.envName + '/DoctorPages/',
    pathologicalTestDetails :  environment.envName + '/PathologicalTests',
    patientFiles:       environment.envName + '/Files/',
    clinicConsultSlots: environment.envName + '/ClinicConsultations/Slots/',
    clinicConsultDets:  environment.envName + '/ClinicConsultations/Details/',
    clinicConsults:     environment.envName + '/ClinicConsultations/Calls/',
    OTPRequests:        environment.envName + '/OTPRequests/',
    consultIds:         environment.envName + '/ConsultIds/',
    checkIns:           environment.envName + '/DoctorPages/Check-Ins/',
    currentQ:           environment.envName + '/DoctorPages/Queue/',
    PatientsInsights:   environment.envName + '/PatientsInsights/',
    Diagnosis:          environment.envName + '/Diagnosis/',
    symptoms:           '/Symptoms/',
    HxFormNames:        environment.envName + '/PatientHxFormNames/',
    HxForms:            environment.envName + '/PatientHxForms/',
    PatientHx:          environment.envName + '/PatientHistory/',
    feedback:           environment.envName + '/Feedback/',
    humanAPI:           environment.envName + '/HumanAPIReturn/',
    Partners:           environment.envName + '/Partners/',
    scrollTo:           environment.envName + '/DoctorPages/ScrollToSection/',
    CareSchedule:       environment.envName+ '/CareSchedule/',
    CarePathways:       environment.envName+ '/CarePathways/',
    TransactionTable:   environment.envName+ '/TransactionTable/'
  }
}