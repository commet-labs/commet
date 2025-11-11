"use server";

import { auth } from "@/lib/auth";
import { commet } from "@/lib/commet";
import { redirect } from "next/navigation";

export interface SignUpState {
  success: boolean;
  message: string;
}

export async function signUpAction(
  prevState: SignUpState,
  formData: FormData,
): Promise<SignUpState> {
  try {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    // Validate inputs
    if (!name || !email || !password) {
      return {
        success: false,
        message: "All fields are required",
      };
    }

    if (password.length < 8) {
      return {
        success: false,
        message: "Password must be at least 8 characters",
      };
    }

    // Step 1: Create Better Auth user
    const userResult = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name,
      },
    });

    if (!userResult || !userResult.user) {
      return {
        success: false,
        message: "Failed to create account. Email may already be in use.",
      };
    }

    const userId = userResult.user.id;

    // Step 2: Create Commet customer
    try {
      const customerResult = await commet.customers.create({
        externalId: userId,
        legalName: name,
        billingEmail: email,
        taxStatus: "NOT_APPLICABLE",
        currency: "USD",
      });

      if (!customerResult.success || !customerResult.data) {
        throw new Error("Failed to create Commet customer");
      }

      // Step 3: Update user with Commet customer ID
      // Note: Better Auth doesn't provide direct update API in server actions
      // The customer ID is stored via externalId which we can use later
      
      console.log("Created Commet customer:", customerResult.data.id);
    } catch (commetError) {
      console.error("Failed to create Commet customer:", commetError);
      // Continue anyway - we can create the customer later if needed
    }

    // Redirect to checkout
    redirect("/checkout");
  } catch (error) {
    console.error("Signup error:", error);
    
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      throw error; // Re-throw redirect errors
    }

    return {
      success: false,
      message:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

