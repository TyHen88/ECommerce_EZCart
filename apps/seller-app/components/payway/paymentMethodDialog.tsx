'use client'

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ABA_Logo, CARD_ICON, Mastercard_Icon, Visa_Icon } from "@/public/assets/index";
import Image from "next/image";

import {
    Field,
    FieldContent,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldSet,
    FieldTitle,
} from "@/components/ui/field";
import {
    RadioGroup,
    RadioGroupItem,
} from "@/components/ui/radio-group";

export function PaymentMethodDialog({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: (isOpen: boolean) => void }) {
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="max-w-md w-full p-0 overflow-hidden">
                <DialogHeader className="px-6 pt-6 pb-4 border-b">
                    <DialogTitle>Payment Method</DialogTitle>
                </DialogHeader>
                <div className="w-full px-6 py-2 ">
                    <FieldGroup>
                        <FieldSet>
                            <FieldDescription className="text-sm text-muted-foreground">
                                Select how you would like to pay for your order.
                            </FieldDescription>
                            <RadioGroup defaultValue="khqr" className="gap-4 mt-4">
                                <FieldLabel htmlFor="khqr-radio-pay">
                                    <Field orientation="horizontal">
                                        <FieldContent>
                                            <FieldTitle>
                                                <span className="flex flex-row items-center">
                                                    <span className="inline-block align-middle mr-3">
                                                        <span className="inline-block align-middle rounded-sm bg-card border border-none flex items-center justify-center p-0 overflow-hidden" style={{ width: 50, height: 50 }}>
                                                            <Image src={ABA_Logo} alt="ABA" width={50} height={50} style={{ objectFit: 'contain' }} />
                                                        </span>
                                                    </span>
                                                    <span>
                                                        <span className="inline-block align-middle">ABA KHQR</span>
                                                        <br />
                                                        <span className="text-muted-foreground inline-block align-middle">
                                                            Scan to pay with any banking app
                                                        </span>
                                                    </span>
                                                </span>
                                            </FieldTitle>
                                        </FieldContent>
                                        <RadioGroupItem value="khqr" id="khqr-radio-pay" />
                                    </Field>
                                </FieldLabel>

                                <FieldLabel htmlFor="card-radio-pay">
                                    <Field orientation="horizontal">
                                        <FieldContent>
                                            <FieldTitle>
                                                <span className="flex flex-row items-center">
                                                    <span className="inline-block align-middle mr-3">
                                                        <span className="inline-block align-middle rounded-sm bg-card border border-none flex items-center justify-center overflow-hidden" style={{ width: 50, height: 50 }}>
                                                            <Image src={CARD_ICON} alt="CARD" width={50} height={50} style={{ objectFit: 'contain' }} />
                                                        </span>
                                                    </span>
                                                    <span>
                                                        <span className="inline-block align-middle">Credit/Debit Card</span>
                                                        <br />
                                                        <span className="flex flex-row items-center gap-1">
                                                            <Image src={Visa_Icon} alt="Visa" width={36} height={20} style={{ objectFit: 'contain' }} />
                                                            <Image src={Mastercard_Icon} alt="MasterCard" width={36} height={20} style={{ objectFit: 'contain' }} />
                                                        </span>
                                                    </span>
                                                </span>
                                            </FieldTitle>
                                        </FieldContent>
                                        <RadioGroupItem value="card" id="card-radio-pay" />
                                    </Field>
                                </FieldLabel>
                            </RadioGroup>
                        </FieldSet>
                    </FieldGroup>
                </div>

                <div className="w-full px-6 pb-4">
                    <div className="flex flex-row-reverse gap-2 w-full">
                        <Button
                            className="min-w-[100px]"
                            type="submit"
                        >
                            Continue
                        </Button>
                        <Button
                            variant="outline"
                            className="min-w-[100px]"
                            type="button"
                            onClick={() => setIsOpen(false)}
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}