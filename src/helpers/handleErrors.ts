import { GraphQLFormattedError } from "graphql";
import { unwrapResolverError } from "@apollo/server/errors";

import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library.js";

export const graphQLHandleErrors = (formattedError: GraphQLFormattedError, error: unknown): GraphQLFormattedError => {
	// Get the original error without GraphQL wrapping. This can be used for error messages more specific.
	const originalError = unwrapResolverError(error);
	// console.log(originalError);

	// Handle DB errors
	if (originalError instanceof PrismaClientKnownRequestError) {
		// console.log(originalError.name);
		if (originalError.meta?.cause) {
			const message = originalError.meta?.cause || originalError.message;
			console.log(message);
			return formattedError;
		} else {
			return { message: originalError.message };
		}
	}

	return formattedError;
};
