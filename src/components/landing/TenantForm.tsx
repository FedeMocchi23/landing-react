import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Share2 } from "lucide-react";

// Schema Zod - CORREZIONI APPLICATE PER GLI ERRORI TYPESCRIPT
const ownerSchema = z.object({
  // Sezione A - Profilo rapido
  properties_count: z.enum(["1", "2-3", "4-10", "10+"]),
  tools_used: z.array(z.string()).max(5, "Massimo 5 strumenti"),
  time_lost_bucket: z.enum(["<2h", "2-5h", "5-10h", "10h+"]),
  
  // Sezione B - Pain Matrix (1-5 per ogni area)
  pain: z.object({
    finance: z.number().min(1).max(5),
    candidates: z.number().min(1).max(5),
    operations: z.number().min(1).max(5),
    maintenance: z.number().min(1).max(5),
    listings: z.number().min(1).max(5),
    comms: z.number().min(1).max(5),
  }),
  
  // Sezione C - Value Matrix (1-5 per ogni area)
  value: z.object({
    finance: z.number().min(1).max(5),
    candidates: z.number().min(1).max(5),
    operations: z.number().min(1).max(5),
    maintenance: z.number().min(1).max(5),
    listings: z.number().min(1).max(5),
    comms: z.number().min(1).max(5),
  }),
  
  // Sezione D - Priorità
  top3: z.array(z.string()).length(3, "Seleziona esattamente 3 priorità"),
  single_priority: z.string().min(1, "Seleziona una priorità principale"),
  
  // Sezione E - Branching (condizionale, max 2 per blocco)
  finance_features: z.array(z.string()).max(2).optional(),
  candidates_features: z.array(z.string()).max(2).optional(),
  operations_features: z.array(z.string()).max(2).optional(),
  maintenance_features: z.array(z.string()).max(2).optional(),
  listings_features: z.array(z.string()).max(2).optional(),
  comms_features: z.array(z.string()).max(2).optional(),
  
  // Sezione F - Servizi
  central_interest: z.enum(["Si", "Forse", "No"]),
  service_types: z.array(z.string()).optional(),
  
  // Sezione G - Intento
  usage_intent: z.enum(["subito", "1mese", "piu-avanti", "no"]),
  wtp_bucket: z.enum(["<10", "10-19", "20-39", "40-69", "70+"]),
  
  // Sezione H - Finale
  wow_text: z.string().max(500).optional(),
  email: z.string().email("Email non valida"),
  consent: z.boolean().refine(val => val === true, "Devi accettare l'informativa privacy"),
});

// Definizione del tipo per maggiore chiarezza TypeScript
type OwnerFormData = z.infer<typeof ownerSchema>;

// Tipi per le chiavi dei campi features
type FeatureFieldNames = 
  | "finance_features" 
  | "candidates_features" 
  | "operations_features"
  | "maintenance_features"
  | "listings_features"
  | "comms_features";

// Tipi per le chiavi pain/value
type PainValueKey = "finance" | "candidates" | "operations" | "maintenance" | "listings" | "comms";

const PRIORITY_OPTIONS = [
  "Gestione Finanziaria",
  "Candidature & Selezione",
  "Operativa Multi-proprietà",
  "Danni & Manutenzioni",
  "Pubblicazione Annunci",
  "Comunicazioni",
];

const PRIORITY_TO_FIELD_MAP: Record<string, FeatureFieldNames> = {
  "Gestione Finanziaria": "finance_features",
  "Candidature & Selezione": "candidates_features",
  "Operativa Multi-proprietà": "operations_features",
  "Danni & Manutenzioni": "maintenance_features",
  "Pubblicazione Annunci": "listings_features",
  "Comunicazioni": "comms_features",
};

const TOOLS_OPTIONS = [
  "Excel / Google Sheets",
  "WhatsApp / Telegram",
  "Email",
  "Gestionale dedicato",
  "Altro",
  "Nessuno",
];

const SERVICE_TYPES = [
  "Idraulico",
  "Elettricista",
  "Pulizie",
  "Tecnico TV/Internet",
];

const FEATURE_OPTIONS: Record<FeatureFieldNames, string[]> = {
  finance_features: [
    "MRR & affitti ricorrenti (vista mensile)",
    "Cash-flow con previsioni",
    "Storico pagamenti per contratto",
    "KPI veloci (incassato/dovuto)",
    "Report PDF per commercialista",
  ],
  candidates_features: [
    "Candidature centralizzate",
    "Documenti pre-verificati",
    "Matching compatibilità (budget, stile, regole)",
    "Profili completi (preferenze, budget)",
    "Calendario visite",
  ],
  operations_features: [
    "Property Switcher unico",
    "Vista unificata (candidature/inquilini/problemi)",
    "Tracciabilità problemi per immobile",
    "Storico lavori & costi per immobile",
    "Ruoli/permessi per collaboratori",
  ],
  maintenance_features: [
    "Segnalazioni con foto (da inquilino)",
    "Responsabilità & ripartizioni tra coinquilini",
    "Database danni (per stanza/categoria)",
    "Stati ticket (open / in_progress / resolved)",
    "Preventivi e fatture salvate",
  ],
  listings_features: [
    "Wizard in 3 step",
    "Geolocalizzazione automatica",
    "Mappatura stanze con amenity",
    "Upload foto massivo per stanze",
    "Bozza automatica finché documenti non verificati",
  ],
  comms_features: [
    "Dashboard unica con tutto",
    "Notifiche integrate (scadenze/aggiornamenti)",
    "Quick Actions (registra pagamento, apri ticket)",
    "Template messaggi (solleciti, promemoria)",
    "Inbox centralizzata (meno WhatsApp/email)",
  ],
};

const PAIN_AREAS: { key: PainValueKey; label: string }[] = [
  { key: "finance", label: "Gestione Finanziaria" },
  { key: "candidates", label: "Candidature & Selezione" },
  { key: "operations", label: "Operativa Multi-proprietà" },
  { key: "maintenance", label: "Danni & Manutenzioni" },
  { key: "listings", label: "Pubblicazione Annunci" },
  { key: "comms", label: "Comunicazioni sparse" },
];

export const OwnerForm = () => {
  const [submitted, setSubmitted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeSection, setActiveSection] = useState<string>("section-a");

  const form = useForm<OwnerFormData>({
    resolver: zodResolver(ownerSchema),
    defaultValues: {
      tools_used: [],
      pain: {
        finance: 3,
        candidates: 3,
        operations: 3,
        maintenance: 3,
        listings: 3,
        comms: 3,
      },
      value: {
        finance: 3,
        candidates: 3,
        operations: 3,
        maintenance: 3,
        listings: 3,
        comms: 3,
      },
      top3: [],
      finance_features: [],
      candidates_features: [],
      operations_features: [],
      maintenance_features: [],
      listings_features: [],
      comms_features: [],
      service_types: [],
      consent: false,
    },
  });

  // Tracking events
  useEffect(() => {
    console.log("owner_q_start", { timestamp: new Date().toISOString() });
  }, []);

  // Watch form changes for tracking
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name) {
        console.log("owner_q_change", { field_id: name, value: value[name as keyof typeof value] });
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  // Calculate progress
  useEffect(() => {
    const subscription = form.watch((values) => {
      let filledSections = 0;
      
      if (values.properties_count && values.time_lost_bucket && values.tools_used && values.tools_used.length > 0) filledSections++;
      if (values.pain) filledSections++;
      if (values.value) filledSections++;
      if (values.top3 && values.top3.length === 3 && values.single_priority) filledSections++;
      
      const top3 = values.top3 || [];
      const firstTwo = top3.slice(0, 2);
      let eComplete = true;
      firstTwo.forEach(priority => {
        const field = PRIORITY_TO_FIELD_MAP[priority];
        if (field && (!values[field] || (values[field] as string[]).length === 0)) {
          eComplete = false;
        }
      });
      if (eComplete && firstTwo.length > 0) filledSections++;
      
      if (values.central_interest) filledSections++;
      if (values.usage_intent && values.wtp_bucket) filledSections++;
      if (values.email && values.consent) filledSections++;
      
      setProgress((filledSections / 8) * 100);
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const onSubmit = (data: OwnerFormData) => {
    const emailHash = btoa(data.email);
    console.log("owner_q_submit", {
      answers: data,
      email_hash: emailHash,
      top_area: data.single_priority,
      wtp_bucket: data.wtp_bucket,
      timestamp: new Date().toISOString(),
    });
    
    toast.success("Grazie per il tuo contributo! Ti ricontatteremo presto.");
    setSubmitted(true);
  };

  const top3 = form.watch("top3");
  const centralInterest = form.watch("central_interest");
  const sectionsToShow = top3?.slice(0, 2).map(p => PRIORITY_TO_FIELD_MAP[p]).filter(Boolean) || [];

  if (submitted) {
    return (
      <Card className="p-8 text-center space-y-6 bg-card border-owner/30">
        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-owner">Grazie!</h3>
          <p className="text-muted-foreground">
            Le tue risposte ci aiuteranno a costruire la piattaforma perfetta per proprietari come te.
          </p>
        </div>
        <Button
          onClick={() => {
            const shareText = "Ho appena completato il questionario per Meet-me, la nuova piattaforma per proprietari!";
            if (navigator.share) {
              navigator.share({ text: shareText });
            } else {
              navigator.clipboard.writeText(shareText);
              toast.success("Testo copiato!");
            }
          }}
          className="bg-owner hover:bg-owner-hover text-owner-foreground"
        >
          <Share2 className="mr-2 h-4 w-4" />
          Condividi
        </Button>
      </Card>
    );
  }

  return (
    <Card className="p-6 md:p-8 bg-card border-owner/30">
      <div className="mb-6 space-y-2">
        <h2 className="text-2xl font-bold text-owner">Questionario Proprietari</h2>
        <p className="text-sm text-muted-foreground">3-4 minuti · {Math.round(progress)}% completato</p>
        <Progress value={progress} className="h-2" />
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Accordion type="single" collapsible value={activeSection} onValueChange={setActiveSection} className="space-y-4">
            
            {/* Sezione A - Profilo rapido */}
            <AccordionItem value="section-a" className="border rounded-lg border-owner/20">
              <AccordionTrigger className="px-4 hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-owner text-owner-foreground flex items-center justify-center text-sm font-bold">A</div>
                  <div className="text-left">
                    <div className="font-semibold">Profilo rapido</div>
                    <div className="text-xs text-muted-foreground">30-40 secondi</div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 space-y-4">
                <FormField
                  control={form.control}
                  name="properties_count"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Q1. Quanti immobili/stanze in affitto gestisci oggi?</FormLabel>
                      <FormControl>
                        <RadioGroup onValueChange={field.onChange} value={field.value} className="grid grid-cols-2 gap-2">
                          {["1", "2-3", "4-10", "10+"].map((option) => (
                            <div key={option} className="flex items-center space-x-2">
                              <RadioGroupItem value={option} id={`prop-${option}`} />
                              <Label htmlFor={`prop-${option}`} className="cursor-pointer">{option}</Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tools_used"
                  render={() => (
                    <FormItem>
                      <FormLabel>Q2. Con quali strumenti lavori oggi? (max 5)</FormLabel>
                      <FormDescription>Seleziona massimo 5 strumenti</FormDescription>
                      <div className="space-y-2">
                        {TOOLS_OPTIONS.map((tool) => (
                          <FormField
                            key={tool}
                            control={form.control}
                            name="tools_used"
                            render={({ field }) => {
                              const isChecked = field.value?.includes(tool);
                              const isDisabled = !isChecked && (field.value?.length || 0) >= 5;
                              return (
                                <FormItem className="flex items-center space-x-2 space-y-0">
                                  <FormControl>
                                    <Checkbox
                                      checked={isChecked}
                                      disabled={isDisabled}
                                      onCheckedChange={(checked) => {
                                        const current = field.value || [];
                                        if (checked) {
                                          field.onChange([...current, tool]);
                                        } else {
                                          field.onChange(current.filter((v) => v !== tool));
                                        }
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className={`cursor-pointer ${isDisabled ? 'opacity-50' : ''}`}>{tool}</FormLabel>
                                </FormItem>
                              );
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="time_lost_bucket"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Q3. Tempo che spendi al mese sulla gestione affitti</FormLabel>
                      <FormControl>
                        <RadioGroup onValueChange={field.onChange} value={field.value} className="grid grid-cols-2 gap-2">
                          {["<2h", "2-5h", "5-10h", "10h+"].map((option) => (
                            <div key={option} className="flex items-center space-x-2">
                              <RadioGroupItem value={option} id={`time-${option}`} />
                              <Label htmlFor={`time-${option}`} className="cursor-pointer">
                                {option === "<2h" ? "< 2 ore" : option === "10h+" ? "> 10 ore" : `${option.replace('h', ' ore')}`}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </AccordionContent>
            </AccordionItem>

            {/* Sezione B - Pain Matrix */}
            <AccordionItem value="section-b" className="border rounded-lg border-owner/20">
              <AccordionTrigger className="px-4 hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-owner text-owner-foreground flex items-center justify-center text-sm font-bold">B</div>
                  <div className="text-left">
                    <div className="font-semibold">Dove fa più male oggi</div>
                    <div className="text-xs text-muted-foreground">40-50 secondi</div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 space-y-4">
                <p className="text-sm text-muted-foreground">
                  Valuta il livello di difficoltà/dolore per ciascuna area (1 = Per nulla, 5 = Estremamente)
                </p>
                {PAIN_AREAS.map(({ key, label }) => (
                  <FormField
                    key={key}
                    control={form.control}
                    name={`pain.${key}`}
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <div className="flex justify-between items-center">
                          <FormLabel className="text-sm">{label}</FormLabel>
                          <span className="text-sm font-semibold text-owner">{field.value}</span>
                        </div>
                        <FormControl>
                          <Slider
                            min={1}
                            max={5}
                            step={1}
                            value={[field.value]}
                            onValueChange={(vals) => field.onChange(vals[0])}
                            className="w-full"
                          />
                        </FormControl>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Per nulla</span>
                          <span>Estremamente</span>
                        </div>
                      </FormItem>
                    )}
                  />
                ))}
              </AccordionContent>
            </AccordionItem>

            {/* Sezione C - Value Matrix */}
            <AccordionItem value="section-c" className="border rounded-lg border-owner/20">
              <AccordionTrigger className="px-4 hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-owner text-owner-foreground flex items-center justify-center text-sm font-bold">C</div>
                  <div className="text-left">
                    <div className="font-semibold">Valore atteso</div>
                    <div className="text-xs text-muted-foreground">40-50 secondi</div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 space-y-4">
                <p className="text-sm text-muted-foreground">
                  Se avessi uno strumento che risolve bene ciascuna area, quanto ti aiuterebbe? (1 = Nulla, 5 = Molto utile)
                </p>
                {PAIN_AREAS.map(({ key, label }) => (
                  <FormField
                    key={key}
                    control={form.control}
                    name={`value.${key}`}
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <div className="flex justify-between items-center">
                          <FormLabel className="text-sm">{label}</FormLabel>
                          <span className="text-sm font-semibold text-owner">{field.value}</span>
                        </div>
                        <FormControl>
                          <Slider
                            min={1}
                            max={5}
                            step={1}
                            value={[field.value]}
                            onValueChange={(vals) => field.onChange(vals[0])}
                            className="w-full"
                          />
                        </FormControl>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Nulla</span>
                          <span>Molto utile</span>
                        </div>
                      </FormItem>
                    )}
                  />
                ))}
              </AccordionContent>
            </AccordionItem>

            {/* Sezione D - Priorità */}
            <AccordionItem value="section-d" className="border rounded-lg border-owner/20">
              <AccordionTrigger className="px-4 hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-owner text-owner-foreground flex items-center justify-center text-sm font-bold">D</div>
                  <div className="text-left">
                    <div className="font-semibold">Priorità</div>
                    <div className="text-xs text-muted-foreground">20-30 secondi</div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 space-y-4">
                <FormField
                  control={form.control}
                  name="top3"
                  render={() => (
                    <FormItem>
                      <FormLabel>Q6. Scegli le tue 3 priorità su cui vorresti aiuto subito</FormLabel>
                      <FormDescription>Seleziona esattamente 3 priorità</FormDescription>
                      <div className="space-y-2">
                        {PRIORITY_OPTIONS.map((priority) => (
                          <FormField
                            key={priority}
                            control={form.control}
                            name="top3"
                            render={({ field }) => {
                              const isChecked = field.value?.includes(priority);
                              const isDisabled = !isChecked && (field.value?.length || 0) >= 3;
                              return (
                                <FormItem className="flex items-center space-x-2 space-y-0">
                                  <FormControl>
                                    <Checkbox
                                      checked={isChecked}
                                      disabled={isDisabled}
                                      onCheckedChange={(checked) => {
                                        const current = field.value || [];
                                        if (checked) {
                                          field.onChange([...current, priority]);
                                        } else {
                                          field.onChange(current.filter((v) => v !== priority));
                                        }
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className={`cursor-pointer ${isDisabled ? 'opacity-50' : ''}`}>{priority}</FormLabel>
                                </FormItem>
                              );
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="single_priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Q7. Se dovessimo partire da una sola area, quale sceglieresti?</FormLabel>
                      <FormControl>
                        <RadioGroup onValueChange={field.onChange} value={field.value} className="space-y-2">
                          {PRIORITY_OPTIONS.map((option) => (
                            <div key={option} className="flex items-center space-x-2">
                              <RadioGroupItem value={option} id={`single-${option}`} />
                              <Label htmlFor={`single-${option}`} className="cursor-pointer">{option}</Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </AccordionContent>
            </AccordionItem>

            {/* Sezione E - Approfondimento smart (branching) */}
            {sectionsToShow.length > 0 && (
              <AccordionItem value="section-e" className="border rounded-lg border-owner/20">
                <AccordionTrigger className="px-4 hover:no-underline">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-owner text-owner-foreground flex items-center justify-center text-sm font-bold">E</div>
                    <div className="text-left">
                      <div className="font-semibold">Approfondimento smart</div>
                      <div className="text-xs text-muted-foreground">40-60 secondi</div>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 space-y-6">
                  {sectionsToShow.map((fieldName) => {
                    const priority = Object.entries(PRIORITY_TO_FIELD_MAP).find(([, v]) => v === fieldName)?.[0];
                    if (!priority) return null;
                    
                    return (
                      <FormField
                        key={fieldName}
                        control={form.control}
                        name={fieldName}
                        render={() => (
                          <FormItem className="border-l-4 border-owner pl-4">
                            <FormLabel className="text-base font-semibold">{priority}</FormLabel>
                            <FormDescription>Quali 2 funzioni ti servono davvero? (max 2)</FormDescription>
                            <div className="space-y-2 mt-2">
                              {FEATURE_OPTIONS[fieldName]?.map((feature) => (
                                <FormField
                                  key={feature}
                                  control={form.control}
                                  name={fieldName}
                                  render={({ field }) => {
                                    const isChecked = field.value?.includes(feature);
                                    const isDisabled = !isChecked && (field.value?.length || 0) >= 2;
                                    return (
                                      <FormItem className="flex items-center space-x-2 space-y-0">
                                        <FormControl>
                                          <Checkbox
                                            checked={isChecked}
                                            disabled={isDisabled}
                                            onCheckedChange={(checked) => {
                                              const current = field.value || [];
                                              if (checked) {
                                                field.onChange([...current, feature]);
                                              } else {
                                                field.onChange(current.filter((v: string) => v !== feature));
                                              }
                                            }}
                                          />
                                        </FormControl>
                                        <FormLabel className={`cursor-pointer text-sm ${isDisabled ? 'opacity-50' : ''}`}>
                                          {feature}
                                        </FormLabel>
                                      </FormItem>
                                    );
                                  }}
                                />
                              ))}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    );
                  })}
                </AccordionContent>
              </AccordionItem>
            )}

            {/* Sezione F - Servizi centralizzati */}
            <AccordionItem value="section-f" className="border rounded-lg border-owner/20">
              <AccordionTrigger className="px-4 hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-owner text-owner-foreground flex items-center justify-center text-sm font-bold">F</div>
                  <div className="text-left">
                    <div className="font-semibold">Servizi centralizzati</div>
                    <div className="text-xs text-muted-foreground">20-30 secondi</div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 space-y-4">
                <FormField
                  control={form.control}
                  name="central_interest"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Q8. Useresti fornitori centralizzati prenotabili in app?</FormLabel>
                      <FormDescription>(idraulico, elettricista, pulizie, tecnico TV/Internet)</FormDescription>
                      <FormControl>
                        <RadioGroup onValueChange={field.onChange} value={field.value} className="grid grid-cols-3 gap-2">
                          {["Si", "Forse", "No"].map((option) => (
                            <div key={option} className="flex items-center space-x-2">
                              <RadioGroupItem value={option} id={`interest-${option}`} />
                              <Label htmlFor={`interest-${option}`} className="cursor-pointer">{option}</Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {(centralInterest === "Si" || centralInterest === "Forse") && (
                  <FormField
                    control={form.control}
                    name="service_types"
                    render={() => (
                      <FormItem>
                        <FormLabel>Q8a. Quali servizi ti interessano?</FormLabel>
                        <div className="space-y-2">
                          {SERVICE_TYPES.map((service) => (
                            <FormField
                              key={service}
                              control={form.control}
                              name="service_types"
                              render={({ field }) => (
                                <FormItem className="flex items-center space-x-2 space-y-0">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(service)}
                                      onCheckedChange={(checked) => {
                                        const current = field.value || [];
                                        if (checked) {
                                          field.onChange([...current, service]);
                                        } else {
                                          field.onChange(current.filter((v) => v !== service));
                                        }
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="cursor-pointer">{service}</FormLabel>
                                </FormItem>
                              )}
                            />
                          ))}
                        </div>
                      </FormItem>
                    )}
                  />
                )}
              </AccordionContent>
            </AccordionItem>

            {/* Sezione G - Intento e prezzo */}
            <AccordionItem value="section-g" className="border rounded-lg border-owner/20">
              <AccordionTrigger className="px-4 hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-owner text-owner-foreground flex items-center justify-center text-sm font-bold">G</div>
                  <div className="text-left">
                    <div className="font-semibold">Intento e prezzo</div>
                    <div className="text-xs text-muted-foreground">20-30 secondi</div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 space-y-4">
                <FormField
                  control={form.control}
                  name="usage_intent"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Q9. Quanto probabilmente useresti Meet-me se risolvesse bene le tue priorità?</FormLabel>
                      <FormControl>
                        <RadioGroup onValueChange={field.onChange} value={field.value} className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="subito" id="intent-subito" />
                            <Label htmlFor="intent-subito" className="cursor-pointer">La userei subito</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="1mese" id="intent-1mese" />
                            <Label htmlFor="intent-1mese" className="cursor-pointer">La proverei entro 1 mese</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="piu-avanti" id="intent-piu-avanti" />
                            <Label htmlFor="intent-piu-avanti" className="cursor-pointer">La proverei "più avanti"</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="no" id="intent-no" />
                            <Label htmlFor="intent-no" className="cursor-pointer">Non credo di usarla</Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="wtp_bucket"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Q10. Quanto pagheresti al mese?</FormLabel>
                      <FormControl>
                        <RadioGroup onValueChange={field.onChange} value={field.value} className="grid grid-cols-2 gap-2">
                          {["<10", "10-19", "20-39", "40-69", "70+"].map((option) => (
                            <div key={option} className="flex items-center space-x-2">
                              <RadioGroupItem value={option} id={`wtp-${option}`} />
                              <Label htmlFor={`wtp-${option}`} className="cursor-pointer">
                                {option === "<10" ? "< €10" : option === "70+" ? "€70+" : `€${option}`}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </AccordionContent>
            </AccordionItem>

            {/* Sezione H - Ultimo tocco */}
            <AccordionItem value="section-h" className="border rounded-lg border-owner/20">
              <AccordionTrigger className="px-4 hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-owner text-owner-foreground flex items-center justify-center text-sm font-bold">H</div>
                  <div className="text-left">
                    <div className="font-semibold">Ultimo tocco</div>
                    <div className="text-xs text-muted-foreground">10-20 secondi</div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 space-y-4">
                <FormField
                  control={form.control}
                  name="wow_text"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Q11. Cosa ti farebbe dire "wow" al day-1? (facoltativo)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Es: Vedere tutti i pagamenti in un'unica dashboard, senza dover aprire Excel..."
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Q12. Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="tua.email@esempio.it" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="consent"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <FormLabel className="cursor-pointer text-sm">
                        Accetto l'informativa privacy per essere ricontattato.
                      </FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </AccordionContent>
            </AccordionItem>

          </Accordion>

          <Button type="submit" size="lg" className="w-full bg-owner hover:bg-owner-hover text-owner-foreground">
            Invia Questionario
          </Button>
        </form>
      </Form>
    </Card>
  );
};