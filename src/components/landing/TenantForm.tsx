import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { toast } from "sonner";

const tenantSchema = z.object({
  looking_for: z.string().min(1, "Seleziona un'opzione"),
  location: z.string().min(1, "Inserisci città/quartiere"),
  move_in_date: z.string().optional(),
  move_out_date: z.string().optional(),
  budget: z.string().min(1, "Seleziona un'opzione"),
  duration: z.string().min(1, "Seleziona un'opzione"),
  compatibility_importance: z.string().min(1, "Seleziona un'opzione"),
  priorities: z.array(z.string()).max(3, "Massimo 3 priorità"),
  lifestyle_preferences: z.array(z.string()),
  matching_attributes: z.array(z.string()),
  app_features: z.array(z.string()),
  events_interest: z.string().min(1, "Seleziona un'opzione"),
  event_types: z.array(z.string()).optional(),
  app_usage: z.string().min(1, "Seleziona un'opzione"),
  wow_factor: z.string().max(200, "Massimo 200 caratteri").optional(),
  email: z.string().email("Email non valida"),
  privacy_consent: z.boolean().refine((val) => val === true, {
    message: "Devi accettare l'informativa privacy",
  }),
});

type TenantFormData = z.infer<typeof tenantSchema>;

export const TenantForm = () => {
  const [submitted, setSubmitted] = useState(false);
  const [showEventTypes, setShowEventTypes] = useState(false);

  const form = useForm<TenantFormData>({
    resolver: zodResolver(tenantSchema),
    defaultValues: {
      priorities: [],
      lifestyle_preferences: [],
      matching_attributes: [],
      app_features: [],
      event_types: [],
      privacy_consent: false,
    },
  });

  const priorities = form.watch("priorities");

  const onSubmit = (data: TenantFormData) => {
    console.log("Tenant form data:", { ...data, segment: "tenant" });
    toast.success("Grazie per il tuo feedback!");
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <Card className="p-8 text-center border-tenant/30">
        <div className="text-5xl mb-4">🎉</div>
        <h3 className="text-2xl font-bold mb-2 text-tenant">Grazie!</h3>
        <p className="text-muted-foreground mb-6">
          Ti aggiorneremo sui prossimi passi. Nel frattempo, condividi questa pagina con altri coinquilini!
        </p>
        <Button 
          variant="outline" 
          className="border-tenant text-tenant hover:bg-tenant/10"
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            toast.success("Link copiato!");
          }}
        >
          Condividi la pagina
        </Button>
      </Card>
    );
  }

  return (
    <Card className="p-6 md:p-8 border-tenant/30">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-tenant mb-2">Questionario Coinquilini</h3>
        <p className="text-muted-foreground">
          Cerchi un coinquilino davvero compatibile? In meno di 1 minuto dicci cosa conta per te: 
          Meet-me ti aiuta a trovare persone allineate (hobby, università, lingue, stile di vita) 
          e a gestire la vita in casa (spese, danni, organizzazione).
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Section A: Current situation */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-tenant">A) Situazione attuale</h4>

            <FormField
              control={form.control}
              name="looking_for"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Q1. Cosa stai cercando?</FormLabel>
                  <FormControl>
                    <RadioGroup onValueChange={field.onChange} value={field.value}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="room" id="looking-room" />
                        <Label htmlFor="looking-room" className="cursor-pointer">Una stanza/casa</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="roommate" id="looking-roommate" />
                        <Label htmlFor="looking-roommate" className="cursor-pointer">Un coinquilino per una casa che ho già</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="both" id="looking-both" />
                        <Label htmlFor="looking-both" className="cursor-pointer">Entrambi</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Q2. Città/Quartiere</FormLabel>
                    <FormControl>
                      <Input placeholder="es. Milano - Loreto" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="space-y-2">
                <Label>Finestra temporale</Label>
                <div className="grid grid-cols-2 gap-2">
                  <FormField
                    control={form.control}
                    name="move_in_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input type="date" placeholder="Da" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="move_out_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input type="date" placeholder="A" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            <FormField
              control={form.control}
              name="budget"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Q3. Budget mensile indicativo (affitto + spese)?</FormLabel>
                  <FormControl>
                    <RadioGroup onValueChange={field.onChange} value={field.value}>
                      {["< €400", "€400-600", "€600-800", "€800-1.000", "> €1.000"].map((option) => (
                        <div key={option} className="flex items-center space-x-2">
                          <RadioGroupItem value={option} id={`budget-${option}`} />
                          <Label htmlFor={`budget-${option}`} className="cursor-pointer">{option}</Label>
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
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Q4. Durata prevista?</FormLabel>
                  <FormControl>
                    <RadioGroup onValueChange={field.onChange} value={field.value}>
                      {["3-4 mesi", "6-8 mesi", ">8 mesi"].map((option) => (
                        <div key={option} className="flex items-center space-x-2">
                          <RadioGroupItem value={option} id={`duration-${option}`} />
                          <Label htmlFor={`duration-${option}`} className="cursor-pointer">{option}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Section B: Compatibility */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-tenant">B) Compatibilità & priorità</h4>

            <FormField
              control={form.control}
              name="compatibility_importance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Q5. Quanto è importante per te la compatibilità con i coinquilini?</FormLabel>
                  <FormControl>
                    <RadioGroup onValueChange={field.onChange} value={field.value}>
                      {["Per nulla", "Poco", "Neutro", "Importante", "Molto importante"].map((option) => (
                        <div key={option} className="flex items-center space-x-2">
                          <RadioGroupItem value={option} id={`compat-${option}`} />
                          <Label htmlFor={`compat-${option}`} className="cursor-pointer">{option}</Label>
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
              name="priorities"
              render={() => (
                <FormItem>
                  <FormLabel>Q6. Scegli le tue 3 priorità (max 3)</FormLabel>
                  <FormDescription>
                    {priorities.length}/3 selezionate
                  </FormDescription>
                  <div className="space-y-2">
                    {[
                      "Compatibilità con coinquilini",
                      "Prezzo totale",
                      "Posizione/trasporti",
                      "Condizioni della casa",
                      "Dimensione stanza/spazi comuni",
                      "Regole chiare (ospiti, orari, pulizie)",
                    ].map((priority) => (
                      <FormField
                        key={priority}
                        control={form.control}
                        name="priorities"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(priority)}
                                disabled={!field.value?.includes(priority) && field.value?.length >= 3}
                                onCheckedChange={(checked) => {
                                  const current = field.value || [];
                                  if (checked) {
                                    if (current.length < 3) {
                                      field.onChange([...current, priority]);
                                    }
                                  } else {
                                    field.onChange(current.filter((v) => v !== priority));
                                  }
                                }}
                              />
                            </FormControl>
                            <Label className="cursor-pointer font-normal">{priority}</Label>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lifestyle_preferences"
              render={() => (
                <FormItem>
                  <FormLabel>Q7. Preferenze di convivenza</FormLabel>
                  <div className="space-y-2">
                    {[
                      "Orari: mattiniero",
                      "Orari: nottambulo",
                      "Clima: tranquillo",
                      "Clima: sociale",
                      "Fumo: sì",
                      "Fumo: no",
                      "Animali domestici: ok",
                      "Animali domestici: meglio di no",
                      "Pulizie: routine settimanale",
                      "Pulizie: flessibili",
                      "Smart working frequente",
                      "Ospiti saltuari ok",
                    ].map((pref) => (
                      <FormField
                        key={pref}
                        control={form.control}
                        name="lifestyle_preferences"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(pref)}
                                onCheckedChange={(checked) => {
                                  const current = field.value || [];
                                  if (checked) {
                                    field.onChange([...current, pref]);
                                  } else {
                                    field.onChange(current.filter((v) => v !== pref));
                                  }
                                }}
                              />
                            </FormControl>
                            <Label className="cursor-pointer font-normal">{pref}</Label>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="matching_attributes"
              render={() => (
                <FormItem>
                  <FormLabel>Q8. Matching "intelligente": cosa vuoi considerare?</FormLabel>
                  <FormDescription className="text-xs">
                    Useremo solo attributi consentiti e utili al matching—niente criteri discriminatori.
                  </FormDescription>
                  <div className="space-y-2">
                    {[
                      "Hobby/interessi (es. sport, musica, gaming)",
                      "Università/corso (es. Politecnico, Economia)",
                      "Lingue (es. scambio IT/EN)",
                      "Background/Origini (es. studenti siciliani a Milano)",
                      "Abitudini (studio/lavoro, orari pasti, fitness)",
                    ].map((attr) => (
                      <FormField
                        key={attr}
                        control={form.control}
                        name="matching_attributes"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(attr)}
                                onCheckedChange={(checked) => {
                                  const current = field.value || [];
                                  if (checked) {
                                    field.onChange([...current, attr]);
                                  } else {
                                    field.onChange(current.filter((v) => v !== attr));
                                  }
                                }}
                              />
                            </FormControl>
                            <Label className="cursor-pointer font-normal text-sm">{attr}</Label>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                </FormItem>
              )}
            />
          </div>

          {/* Section C: Practical life */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-tenant">C) Vita da coinquilino (gestione pratica)</h4>

            <FormField
              control={form.control}
              name="app_features"
              render={() => (
                <FormItem>
                  <FormLabel>Q9. Ti interessa che l'app ti aiuti a...</FormLabel>
                  <div className="space-y-2">
                    {[
                      "Tracciare danni con foto e responsabilità (tutela cauzione)",
                      "Dividere spese stile Splitwise (affitto, bollette, extra)",
                      "Calendario di casa (scadenze affitto, pulizie, eventi)",
                      "Segnalare problemi e prenotare fornitori verificati",
                      "Chat e bacheca di casa",
                    ].map((feature) => (
                      <FormField
                        key={feature}
                        control={form.control}
                        name="app_features"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(feature)}
                                onCheckedChange={(checked) => {
                                  const current = field.value || [];
                                  if (checked) {
                                    field.onChange([...current, feature]);
                                  } else {
                                    field.onChange(current.filter((v) => v !== feature));
                                  }
                                }}
                              />
                            </FormControl>
                            <Label className="cursor-pointer font-normal text-sm">{feature}</Label>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="events_interest"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Q10. Eventi e social nella tua zona: ti piacerebbe?</FormLabel>
                  <FormControl>
                    <RadioGroup 
                      onValueChange={(value) => {
                        field.onChange(value);
                        setShowEventTypes(value === "Sì, mi interessa" || value === "Forse");
                      }} 
                      value={field.value}
                    >
                      {["Sì, mi interessa", "Forse", "No, non ora"].map((option) => (
                        <div key={option} className="flex items-center space-x-2">
                          <RadioGroupItem value={option} id={`events-${option}`} />
                          <Label htmlFor={`events-${option}`} className="cursor-pointer">{option}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {showEventTypes && (
              <FormField
                control={form.control}
                name="event_types"
                render={() => (
                  <FormItem className="pl-4 border-l-2 border-tenant/30">
                    <FormLabel>Q10a. Che tipo di eventi?</FormLabel>
                    <div className="space-y-2">
                      {[
                        "Università",
                        "Sport",
                        "Musica",
                        "Community regionali (es. Sicilia)",
                        "Lingue",
                        "Altro",
                      ].map((type) => (
                        <FormField
                          key={type}
                          control={form.control}
                          name="event_types"
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(type)}
                                  onCheckedChange={(checked) => {
                                    const current = field.value || [];
                                    if (checked) {
                                      field.onChange([...current, type]);
                                    } else {
                                      field.onChange(current.filter((v) => v !== type));
                                    }
                                  }}
                                />
                              </FormControl>
                              <Label className="cursor-pointer font-normal">{type}</Label>
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                  </FormItem>
                )}
              />
            )}
          </div>

          {/* Section D: Usage & feedback */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-tenant">D) Utilizzo e feedback</h4>

            <FormField
              control={form.control}
              name="app_usage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Q11. Quanto useresti un'app così?</FormLabel>
                  <FormControl>
                    <RadioGroup onValueChange={field.onChange} value={field.value}>
                      {[
                        "Solo per trovare coinquilino",
                        "Per trovare coinquilino e gestire la casa",
                        "La userei ogni settimana",
                        "La userei solo all'inizio",
                      ].map((option) => (
                        <div key={option} className="flex items-center space-x-2">
                          <RadioGroupItem value={option} id={`usage-${option}`} />
                          <Label htmlFor={`usage-${option}`} className="cursor-pointer">{option}</Label>
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
              name="wow_factor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Q12. Cosa ti farebbe dire "wow"? (facoltativo)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Es. Se trovasse coinquilini con i miei stessi orari di studio..."
                      maxLength={200}
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    {field.value?.length || 0}/200 caratteri
                  </FormDescription>
                </FormItem>
              )}
            />
          </div>

          {/* Email & Privacy */}
          <div className="pt-6 border-t space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email *</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="la-tua-email@esempio.it" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="privacy_consent"
              render={({ field }) => (
                <FormItem className="flex items-start space-x-2 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="cursor-pointer font-normal">
                      Accetto l'informativa privacy per essere ricontattato. *
                    </FormLabel>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
          </div>

          <Button 
            type="submit" 
            size="lg" 
            className="w-full bg-tenant hover:bg-tenant-hover text-tenant-foreground"
          >
            Invia feedback
          </Button>
        </form>
      </Form>
    </Card>
  );
};
