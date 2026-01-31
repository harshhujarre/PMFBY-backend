# PMFBY

## Product

### Farm Map

1. the goal of this app to efficiently implement PMFBY 
2. this system will integrate with currunt working of pradhan mantri fasal bima yojana
3. this system will hwalp government detect the disaster like flood, drought, etc and estimate yield loss of crop using ndiv data provided by satalite 
4. we are making prototype of the system so we can fake the satalite data and test the system

5. we should able to create a fake demo in which we will depict the flood situation and estimate the yield loss of crop and and generate an insurance claim for the farmer 

# working of the system 

1. the GEE will provide the satalite data of the farm  with ndiv 
2. system will keep track of the ndiv 
3. if ndiv drops in the threshold value then system will generate a alert 
4. an ai resoning model will analyse the satalite data and estimate the yield loss of crop 
5. we estimate an ensurance claim for the farmer 
6. we will use human in the loop approach to validate the ai resoning model and ensurance amount 

# Currunt working of PMFBY (mannually)
Case 1: Disease is widespread in the area (most common outcome)
If pest/disease affects large part of the Insurance Unit (IU) (village/block):
👉 Farmers do NOT apply individually

Process:
Govt conducts Crop Cutting Experiments (CCEs)

Average yield of IU calculated

If yield < threshold yield
→ ALL insured farmers in that IU get payout

Even farmers whose fields look fine still get money.
And farmers with heavy loss get the same rate as others.

This is area insurance logic.
🌱 Case 2: Disease affects only a few farms (localized damage)

This is tricky and many people misunderstand.

PMFBY allows individual claims only under “Localized Calamity” category.
But:

Scheme mainly lists:

Hailstorm

Landslide

Inundation (flood pockets)

Pest/disease is rarely accepted as localized claim unless state notifies it.

If state allows it:
Farmer must:

Inform within 72 hours of noticing damage

Use:

CSC

Insurance company number

Agriculture officer

Provide:

Farm details

Crop type

Approx damage

Then:

Field officer visits
Geo-tagged photos taken
Report prepared
Insurer processes individual payout
This is slow and often disputed.


