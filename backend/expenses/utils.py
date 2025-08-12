from decimal import Decimal, InvalidOperation
from moneyed import Money
from rest_framework.exceptions import ValidationError

def get_money_from_data(amount, currency, allow_zero=True):
    """
    Extracts amount + currency from a dict-like object and returns a Money instance.
    Raises ValidationError with a uniform {'detail': <msg>} structure on error.
    """
    try:
        amount_decimal = Decimal(str(amount))
    except (InvalidOperation, TypeError):
        raise ValidationError({'detail': 'Invalid amount'})
    if amount_decimal < 0 or (not allow_zero and amount_decimal == 0):
        raise ValidationError({'detail': 'Amount must be positive' if not allow_zero else 'Amount must be non-negative'})
    if not currency or not isinstance(currency, str):
        raise ValidationError({'detail': 'Invalid currency'})
    return Money(amount_decimal, currency.upper())
