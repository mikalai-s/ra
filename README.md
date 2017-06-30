To run the app locally:

```bash
git clone https://github.com/mikalai-silivonik/ra.git
cd ra
npm install
npm start
```

I picked greedy approach to implement assignment features. The idea is that all employees are assigned to an each day and then iteration by iteration we adjust that using constraints. The following constraints are implemented for features 1 and 2:
 - two employees per shift
 - day-offs request consideration

If there is situation when a day cannot be full-filled with required number of employees, whole routines is repeated with some day-off requests canceled. Please see code comments.

I also implemented a priority queue that provides more fair distribution of employees during a week.

To implement features 3-6 I would follow existing approach with some tweaks. Constraints in these cases have to be executed one-by-one for a day, as opposed to one-by-one for a week as in current implementation. MAX_SHIFTS is pretty straight forward: skip function of an employee queue would have one more filter that checks whether given person is assigned more than given number of times.