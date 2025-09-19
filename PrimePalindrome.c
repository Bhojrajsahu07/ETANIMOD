//Program to print prime palindrome till 1000
#include <stdio.h>

int checkprime(int no)
{
    int c=0;
    for(int i=1; i<no; i++)
    {
        if(no%i==0)
        c++;
    }
    if(c==1)
    return 1;
    else
    return 0;
}
int checkPali(int no)
{
    int rev=0;
    for(int i=no; i!=0; i=i/10)
    {
        int d=i%10;
        rev= rev*10 +d;
    }
    if(no==rev)
    return 1;
    else
    return 0;
}
int main()
{
    int check1, check2;
    for(int i=10; i<1000; i++)
    {
        check1=checkprime(i);
        check2=checkPali(i);
        if(check1==1 && check2==1)
        printf("%d\n", i);
    }
    printf("Bhoj is here");

}
